from django.views.generic import TemplateView, CreateView
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.shortcuts import redirect

from core.models import Customer, Product, SalesBill, SalesBillItem
from core.forms import CustomerForm, ProductForm


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


class SalesBillCreateView(LoginRequiredMixin, TemplateView):
    template_name = "create_sales_bill.html"
    success_url = reverse_lazy("home")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["customers"] = Customer.objects.all()
        context["products"] = Product.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        customers = Customer.objects.all()
        products = Product.objects.all()

        customer_id = request.POST.get("customer")
        customer = Customer.objects.get(id=customer_id)

        bill = SalesBill.objects.create(
            customer=customer, user=request.user, total_amount=0
        )

        total = 0
        items_data = zip(
            request.POST.getlist("product"), request.POST.getlist("quantity")
        )

        for prod_id, qty in items_data:
            prod = Product.objects.get(id=prod_id)
            qty = int(qty)
            subtotal = prod.price * qty
            SalesBillItem.objects.create(
                bill=bill,
                product=prod,
                quantity=qty,
                price=prod.price,
                subtotal=subtotal,
            )
            total += subtotal

        bill.total_amount = total
        bill.save()
        messages.success(request, f"Sales Bill #{bill.id} Created Successfully!")
        return redirect("home")
