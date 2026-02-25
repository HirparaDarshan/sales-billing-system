from django.urls import path

from .views import HomeView, RegisterView, UserLoginView, UserLogoutView

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
]
