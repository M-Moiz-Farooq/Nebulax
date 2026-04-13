import os

from django.core.management.base import BaseCommand

from core.models import ROLES, User


class Command(BaseCommand):
    help = "Create one ADMIN from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD if no admin exists."

    def handle(self, *args, **options):
        if User.objects.filter(role=ROLES.ADMIN).exists():
            self.stdout.write(self.style.WARNING("Admin already exists — skipping seed."))
            return
        email = (os.environ.get("SEED_ADMIN_EMAIL") or "").strip()
        password = (os.environ.get("SEED_ADMIN_PASSWORD") or "").strip()
        if not email or not password:
            self.stderr.write("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in backend/.env")
            return
        if len(password) < 8:
            self.stderr.write("SEED_ADMIN_PASSWORD must be at least 8 characters.")
            return
        User.objects.create_user(email=email, password=password, role=ROLES.ADMIN)
        self.stdout.write(self.style.SUCCESS(f"Seeded ADMIN: {email}"))
