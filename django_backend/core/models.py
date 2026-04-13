from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class ROLES:
    ADMIN = "ADMIN"
    ACCOUNTANT = "ACCOUNTANT"
    USER = "USER"


ROLE_CHOICES = [(ROLES.ADMIN, ROLES.ADMIN), (ROLES.ACCOUNTANT, ROLES.ACCOUNTANT), (ROLES.USER, ROLES.USER)]


class TRANSACTION_TYPES:
    CREDIT = "credit"
    DEBIT = "debit"


class NOTE_TYPES:
    CREDIT = "credit_note"
    DEBIT = "debit_note"


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role=ROLES.USER):
        email = self.normalize_email(email)
        user = self.model(email=email, role=role)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        return self.create_user(email, password=password, role=ROLES.ADMIN)


class User(AbstractBaseUser):
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLES.USER)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Transaction(models.Model):
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    type = models.CharField(
        max_length=10,
        choices=[
            (TRANSACTION_TYPES.CREDIT, TRANSACTION_TYPES.CREDIT),
            (TRANSACTION_TYPES.DEBIT, TRANSACTION_TYPES.DEBIT),
        ],
    )
    description = models.TextField(max_length=2000)
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.type} {self.amount}"


class Note(models.Model):
    note_type = models.CharField(
        max_length=20,
        choices=[(NOTE_TYPES.CREDIT, NOTE_TYPES.CREDIT), (NOTE_TYPES.DEBIT, NOTE_TYPES.DEBIT)],
    )
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    description = models.TextField(max_length=2000)
    date = models.DateTimeField()
    reference = models.CharField(max_length=100, blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
