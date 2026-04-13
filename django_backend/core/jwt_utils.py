"""JWT compatible with the former Node jsonwebtoken payloads: { sub, role, exp, iat }."""
import os
from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings


def _expires_delta():
    raw = getattr(settings, "JWT_EXPIRES_IN", "7d") or "7d"
    s = str(raw).strip().lower()
    try:
        if s.endswith("h"):
            return timedelta(hours=int(s[:-1]))
        if s.endswith("d"):
            return timedelta(days=int(s[:-1]))
        if s.endswith("m"):
            return timedelta(minutes=int(s[:-1]))
    except ValueError:
        pass
    return timedelta(days=7)


def sign_token(user_id, role):
    secret = settings.JWT_SECRET
    if not secret or len(secret) < 32:
        raise ValueError("JWT_SECRET must be set and at least 32 characters")
    now = datetime.now(timezone.utc)
    exp = now + _expires_delta()
    payload = {
        "sub": str(user_id),
        "role": role,
        "iat": now,
        "exp": exp,
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def verify_token(token):
    secret = settings.JWT_SECRET
    if not secret:
        raise ValueError("JWT_SECRET is not configured")
    return jwt.decode(token, secret, algorithms=["HS256"])
