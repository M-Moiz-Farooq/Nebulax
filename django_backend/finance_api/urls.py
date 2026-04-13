from django.urls import path

from core import views

urlpatterns = [
    path("api/health", views.health),
    path("api/auth/signup", views.auth_signup),
    path("api/auth/login", views.auth_login),
    path("api/users", views.users_list_or_create),
    path("api/transactions", views.transactions_collection),
    path("api/transactions/<int:pk>", views.transactions_detail),
    path("api/notes/credit", views.notes_credit),
    path("api/notes/debit", views.notes_debit),
]

handler404 = views.not_found
