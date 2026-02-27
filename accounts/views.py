from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "home.html"
    login_url = reverse_lazy("login")


class UserLoginView(LoginView):
    template_name = "login.html"
    authentication_form = AuthenticationForm
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy("home")


class UserLogoutView(LogoutView):
    next_page = reverse_lazy("login")


class RegisterView(CreateView):
    template_name = "register.html"
    form_class = UserCreationForm
    success_url = reverse_lazy("login")

    def get_form(self):
        form = super().get_form()
        for field in form.fields.values():
            field.widget.attrs["class"] = "form-control"
        return form

    def form_valid(self, form):
        form.save()
        messages.success(self.request, "Account Created Successfully")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Please correct the errors below")
        return super().form_invalid(form)
