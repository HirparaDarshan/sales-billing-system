from django.urls import path
from core import views

urlpatterns = [
    path("", views.home, name="home"),
    path("login/", views.user_login, name="login"),
    path("register/", views.register, name="register"),
    path("logout/", views.user_logout, name="logout"),
    path("create-customer/", views.create_customer, name="create_customer"),
    path("create-product/", views.create_product, name="create_product"),
    path("create-sales-bill/", views.create_sales_bill, name="create_sales_bill"),
]
