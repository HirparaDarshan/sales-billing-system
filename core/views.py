from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from django.shortcuts import redirect, render

from core.forms import CustomerForm, ProductForm, SalesBillItemFormSet
from core.models import Customer, Product, SalesBill, SalesBillItem


def home(request):
    if not request.user.is_authenticated:
        return redirect("login")
    return render(request, "home.html")


def user_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            messages.error(request, "Invalid Username or Password")

    return render(request, "login.html")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
        else:
            User.objects.create_user(username=username, password=password)
            messages.success(request, "Account Created Successfully")
            return redirect("login")

    return render(request, "register.html")


def user_logout(request):
    logout(request)
    return redirect("login")


@login_required
def create_customer(request):
    form = CustomerForm()

    if request.method == "POST":
        form = CustomerForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Customer Created Successfully")
            return redirect("home")

    return render(request, "create_customer.html", {"form": form})


@login_required
def create_product(request):
    form = ProductForm()

    if request.method == "POST":
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Product Created Successfully")
            return redirect("home")

    return render(request, "create_product.html", {"form": form})


@login_required
@transaction.atomic
def create_sales_bill(request):
    customers = Customer.objects.all()
    products = Product.objects.all()

    if request.method == "POST":
        customer_id = request.POST.get("customer")
        customer = Customer.objects.get(id=customer_id)

        bill = SalesBill.objects.create(
            customer=customer, user=request.user, total_amount=0  # will update later
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

    return render(
        request,
        "create_sales_bill.html",
        {
            "customers": customers,
            "products": products,
        },
    )
