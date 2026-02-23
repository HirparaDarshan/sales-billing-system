from django.views.generic import TemplateView, CreateView
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.shortcuts import redirect

from core.models import Customer, Product, SalesBill
from core.forms import CustomerForm, ProductForm, SalesBillItemFormSet


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


class CustomerCreateView(LoginRequiredMixin, CreateView):
    model = Customer
    form_class = CustomerForm
    template_name = "create_customer.html"
    success_url = reverse_lazy("home")

    def form_valid(self, form):
        messages.success(self.request, "Customer Created Successfully")
        return super().form_valid(form)


class ProductCreateView(LoginRequiredMixin, CreateView):
    model = Product
    form_class = ProductForm
    template_name = "create_product.html"
    success_url = reverse_lazy("home")

    def form_valid(self, form):
        messages.success(self.request, "Product Created Successfully")
        return super().form_valid(form)


class SalesBillCreateView(LoginRequiredMixin, CreateView):
    model = SalesBill
    fields = ["customer"]
    template_name = "create_sales_bill.html"
    success_url = reverse_lazy("home")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["customers"] = Customer.objects.all()
        context["products"] = Product.objects.all()

        if self.request.POST:
            context["formset"] = SalesBillItemFormSet(self.request.POST)
        else:
            context["formset"] = SalesBillItemFormSet()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context["formset"]

        form.instance.user = self.request.user

        if formset.is_valid():
            self.object = form.save()
            formset.instance = self.object
            formset.save()

            total = 0
            for item in self.object.items.all():
                item.price = item.product.price
                item.subtotal = item.product.price * item.quantity
                item.save()
                total += item.subtotal

            self.object.total_amount = total
            self.object.save()

            messages.success(
                self.request, f"Sales Bill #{self.object.id} Created Successfully!"
            )
            return super().form_valid(form)

        messages.error(self.request, "Please correct the errors below in products.")
        return self.form_invalid(form)
