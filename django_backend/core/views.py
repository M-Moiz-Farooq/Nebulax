import json
import re
from decimal import Decimal, InvalidOperation
from functools import wraps

import jwt
from django.conf import settings
from django.db import IntegrityError
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from core.jwt_utils import sign_token, verify_token
from core.models import NOTE_TYPES, ROLES, TRANSACTION_TYPES, Note, Transaction, User


def _iso(dt):
    if dt is None:
        return None
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt, timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


def _user_nested(u):
    return {"_id": str(u.id), "email": u.email, "role": u.role}


def _tx_json(tx):
    return {
        "_id": str(tx.id),
        "amount": float(tx.amount),
        "type": tx.type,
        "description": tx.description,
        "date": _iso(tx.date),
        "user": _user_nested(tx.user),
        "createdAt": _iso(tx.created_at),
        "updatedAt": _iso(tx.updated_at),
    }


def _note_json(n):
    return {
        "_id": str(n.id),
        "noteType": n.note_type,
        "amount": float(n.amount),
        "description": n.description,
        "date": _iso(n.date),
        "reference": n.reference or "",
        "user": _user_nested(n.user),
        "createdAt": _iso(n.created_at),
        "updatedAt": _iso(n.updated_at),
    }


def _json_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return None


def jwt_auth(view):
    @wraps(view)
    def inner(request, *args, **kwargs):
        header = request.META.get("HTTP_AUTHORIZATION", "")
        parts = header.split()
        if len(parts) != 2 or parts[0] != "Bearer":
            return JsonResponse(
                {"success": False, "message": "Authentication required", "code": "NO_TOKEN"},
                status=401,
            )
        token = parts[1]
        try:
            payload = verify_token(token)
        except jwt.ExpiredSignatureError:
            return JsonResponse(
                {"success": False, "message": "Token expired", "code": "TOKEN_EXPIRED"},
                status=401,
            )
        except jwt.InvalidTokenError:
            return JsonResponse(
                {"success": False, "message": "Invalid token", "code": "INVALID_TOKEN"},
                status=401,
            )
        try:
            user = User.objects.get(pk=int(payload["sub"]))
        except (User.DoesNotExist, ValueError, TypeError):
            return JsonResponse(
                {"success": False, "message": "User no longer exists", "code": "USER_GONE"},
                status=401,
            )
        request.jwt_user = user
        return view(request, *args, **kwargs)

    return inner


def require_roles(*allowed):
    def deco(view):
        @wraps(view)
        def inner(request, *args, **kwargs):
            u = getattr(request, "jwt_user", None)
            if not u:
                return JsonResponse(
                    {"success": False, "message": "Authentication required", "code": "NO_USER"},
                    status=401,
                )
            if u.role not in allowed:
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Insufficient permissions for this resource",
                        "code": "FORBIDDEN_ROLE",
                    },
                    status=403,
                )
            return view(request, *args, **kwargs)

        return inner

    return deco


@csrf_exempt
def health(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)
    return JsonResponse({"success": True, "message": "ok", "timestamp": timezone.now().isoformat()})


def _validate_signup_password(pw):
    if len(pw) < 8:
        return "Password must be at least 8 characters"
    if not re.search(r"[A-Za-z]", pw):
        return "Password must contain at least one letter"
    return None


@csrf_exempt
def auth_signup(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)
    body = _json_body(request)
    if body is None:
        return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse(
            {
                "success": False,
                "message": "Validation failed",
                "errors": [{"field": "email", "message": "Valid email is required"}],
            },
            status=400,
        )
    err = _validate_signup_password(password)
    if err:
        return JsonResponse(
            {"success": False, "message": "Validation failed", "errors": [{"field": "password", "message": err}]},
            status=400,
        )
    try:
        user = User.objects.create_user(email=email, password=password, role=ROLES.USER)
    except IntegrityError:
        return JsonResponse({"success": False, "message": "email already exists", "code": "DUPLICATE"}, status=409)
    token = sign_token(user.id, user.role)
    return JsonResponse(
        {
            "success": True,
            "message": "User registered",
            "data": {
                "user": {"id": str(user.id), "email": user.email, "role": user.role},
                "token": token,
                "expiresIn": settings.JWT_EXPIRES_IN or "7d",
            },
        },
        status=201,
    )


@csrf_exempt
def auth_login(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)
    body = _json_body(request)
    if body is None:
        return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    if not email or not password:
        return JsonResponse(
            {"success": False, "message": "Invalid credentials", "code": "INVALID_CREDENTIALS"},
            status=401,
        )
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse(
            {"success": False, "message": "Invalid credentials", "code": "INVALID_CREDENTIALS"},
            status=401,
        )
    if not user.check_password(password):
        return JsonResponse(
            {"success": False, "message": "Invalid credentials", "code": "INVALID_CREDENTIALS"},
            status=401,
        )
    token = sign_token(user.id, user.role)
    return JsonResponse(
        {
            "success": True,
            "message": "Login successful",
            "data": {
                "user": {"id": str(user.id), "email": user.email, "role": user.role},
                "token": token,
                "expiresIn": settings.JWT_EXPIRES_IN or "7d",
            },
        }
    )


@csrf_exempt
@jwt_auth
@require_roles(ROLES.ADMIN)
def users_list_or_create(request):
    if request.method == "GET":
        users = User.objects.order_by("-created_at")
        data = [
            {"_id": str(u.id), "email": u.email, "role": u.role, "createdAt": _iso(u.created_at)}
            for u in users
        ]
        return JsonResponse({"success": True, "data": {"users": data}})

    if request.method == "POST":
        body = _json_body(request)
        if body is None:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        role = body.get("role") or ""
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"success": False, "message": "Valid email is required"}, status=400)
        if len(password) < 8:
            return JsonResponse({"success": False, "message": "Password must be at least 8 characters"}, status=400)
        if role not in (ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.USER):
            return JsonResponse({"success": False, "message": "Invalid role"}, status=400)
        try:
            user = User.objects.create_user(email=email, password=password, role=role)
        except IntegrityError:
            return JsonResponse({"success": False, "message": "email already exists", "code": "DUPLICATE"}, status=409)
        return JsonResponse(
            {
                "success": True,
                "message": "User created",
                "data": {"user": {"id": str(user.id), "email": user.email, "role": user.role}},
            },
            status=201,
        )

    return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_auth
def transactions_collection(request):
    u = request.jwt_user
    if request.method == "GET":
        q = Transaction.objects.select_related("user")
        if u.role == ROLES.USER:
            q = q.filter(user=u)
        txs = [_tx_json(t) for t in q.order_by("-date")]
        return JsonResponse({"success": True, "data": {"transactions": txs}})

    if request.method == "POST":
        # USER may add rows for themselves; ADMIN / ACCOUNTANT same (audit: user field = creator)
        if u.role not in (ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.USER):
            return JsonResponse(
                {"success": False, "message": "Insufficient permissions for this resource", "code": "FORBIDDEN_ROLE"},
                status=403,
            )
        body = _json_body(request)
        if body is None:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
        try:
            amount = Decimal(str(body.get("amount")))
        except (InvalidOperation, TypeError):
            return JsonResponse({"success": False, "message": "Amount must be a number greater than 0"}, status=400)
        if amount <= 0:
            return JsonResponse({"success": False, "message": "Amount must be a number greater than 0"}, status=400)
        ttype = body.get("type")
        if ttype not in (TRANSACTION_TYPES.CREDIT, TRANSACTION_TYPES.DEBIT):
            return JsonResponse({"success": False, "message": "Type must be credit or debit"}, status=400)
        desc = (body.get("description") or "").strip()
        if not desc or len(desc) > 2000:
            return JsonResponse({"success": False, "message": "Description is required (max 2000 chars)"}, status=400)
        dt = timezone.now()
        if body.get("date"):
            try:
                from django.utils.dateparse import parse_datetime

                dt = parse_datetime(body["date"]) or dt
            except Exception:
                pass
        tx = Transaction.objects.create(
            amount=amount, type=ttype, description=desc, date=dt, user=u
        )
        tx.refresh_from_db()
        return JsonResponse(
            {
                "success": True,
                "message": "Transaction created",
                "data": {"transaction": _tx_json(tx)},
            },
            status=201,
        )

    return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_auth
def transactions_detail(request, pk):
    u = request.jwt_user
    try:
        tx = Transaction.objects.select_related("user").get(pk=pk)
    except (Transaction.DoesNotExist, ValueError):
        return JsonResponse({"success": False, "message": "Transaction not found", "code": "NOT_FOUND"}, status=404)

    if request.method == "PUT":
        if u.role not in (ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.USER):
            return JsonResponse(
                {"success": False, "message": "Insufficient permissions for this resource", "code": "FORBIDDEN_ROLE"},
                status=403,
            )
        if u.role == ROLES.USER and tx.user_id != u.id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You can only edit your own transactions",
                    "code": "FORBIDDEN_ROLE",
                },
                status=403,
            )
        body = _json_body(request)
        if body is None:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
        if "amount" in body and body["amount"] is not None:
            try:
                amt = Decimal(str(body["amount"]))
            except (InvalidOperation, TypeError):
                return JsonResponse({"success": False, "message": "Amount must be greater than 0"}, status=400)
            if amt <= 0:
                return JsonResponse({"success": False, "message": "Amount must be greater than 0"}, status=400)
            tx.amount = amt
        if "type" in body and body["type"] is not None:
            if body["type"] not in (TRANSACTION_TYPES.CREDIT, TRANSACTION_TYPES.DEBIT):
                return JsonResponse({"success": False, "message": "Type must be credit or debit"}, status=400)
            tx.type = body["type"]
        if "description" in body and body["description"] is not None:
            d = (body["description"] or "").strip()
            if not d or len(d) > 2000:
                return JsonResponse({"success": False, "message": "Description cannot be empty"}, status=400)
            tx.description = d
        if "date" in body and body["date"]:
            from django.utils.dateparse import parse_datetime

            parsed = parse_datetime(body["date"])
            if parsed:
                tx.date = parsed
        tx.save()
        return JsonResponse({"success": True, "message": "Transaction updated", "data": {"transaction": _tx_json(tx)}})

    if request.method == "DELETE":
        if u.role != ROLES.ADMIN:
            return JsonResponse(
                {"success": False, "message": "Insufficient permissions for this resource", "code": "FORBIDDEN_ROLE"},
                status=403,
            )
        tx.delete()
        return JsonResponse({"success": True, "message": "Transaction deleted"})

    return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_auth
@require_roles(ROLES.ADMIN, ROLES.ACCOUNTANT)
def notes_credit(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)
    u = request.jwt_user
    body = _json_body(request)
    if body is None:
        return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
    try:
        amount = Decimal(str(body.get("amount")))
    except (InvalidOperation, TypeError):
        return JsonResponse({"success": False, "message": "Amount must be a number greater than 0"}, status=400)
    if amount <= 0:
        return JsonResponse({"success": False, "message": "Amount must be a number greater than 0"}, status=400)
    desc = (body.get("description") or "").strip()
    if not desc or len(desc) > 2000:
        return JsonResponse({"success": False, "message": "Description is required"}, status=400)
    ref = (body.get("reference") or "").strip()[:100]
    dt = timezone.now()
    if body.get("date"):
        from django.utils.dateparse import parse_datetime

        p = parse_datetime(body["date"])
        if p:
            dt = p
    note = Note.objects.create(
        note_type=NOTE_TYPES.CREDIT,
        amount=amount,
        description=desc,
        date=dt,
        reference=ref,
        user=u,
    )
    return JsonResponse(
        {"success": True, "message": "Credit note created", "data": {"note": _note_json(note)}},
        status=201,
    )


@csrf_exempt
@jwt_auth
@require_roles(ROLES.ADMIN, ROLES.ACCOUNTANT)
def notes_debit(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)
    u = request.jwt_user
    body = _json_body(request)
    if body is None:
        return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)
    try:
        amount = Decimal(str(body.get("amount")))
    except (InvalidOperation, TypeError):
        return JsonResponse({"success": False, "message": "Amount must be a number greater than 0"}, status=400)
    if amount <= 0:
        return JsonResponse({"success": False, "message": "Amount must be a number greater than 0"}, status=400)
    desc = (body.get("description") or "").strip()
    if not desc or len(desc) > 2000:
        return JsonResponse({"success": False, "message": "Description is required"}, status=400)
    ref = (body.get("reference") or "").strip()[:100]
    dt = timezone.now()
    if body.get("date"):
        from django.utils.dateparse import parse_datetime

        p = parse_datetime(body["date"])
        if p:
            dt = p
    note = Note.objects.create(
        note_type=NOTE_TYPES.DEBIT,
        amount=amount,
        description=desc,
        date=dt,
        reference=ref,
        user=u,
    )
    return JsonResponse(
        {"success": True, "message": "Debit note created", "data": {"note": _note_json(note)}},
        status=201,
    )


def not_found(request, exception=None):
    return JsonResponse(
        {
            "success": False,
            "message": f"Route not found: {request.method} {request.path}",
            "code": "NOT_FOUND",
        },
        status=404,
    )
