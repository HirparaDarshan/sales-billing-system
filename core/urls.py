from django.urls import path

from core.views import (
    HomeView,
    UserLoginView,
    UserLogoutView,
    RegisterView,
    CustomerCreateView,
    ProductCreateView,
    SalesBillCreateView,
)

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("create-customer/", CustomerCreateView.as_view(), name="create_customer"),
    path("create-product/", ProductCreateView.as_view(), name="create_product"),
    path("create-sales-bill/", SalesBillCreateView.as_view(), name="create_sales_bill"),
]
