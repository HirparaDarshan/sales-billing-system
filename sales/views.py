from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.shortcuts import redirect
from django.db import transaction

from customers.forms import CustomerForm
from products.forms import ProductForm
from products.models import Product
from sales.models import SalesBill, SalesBillItem
from sales.tasks import generate_pdf_and_send_email


class SalesBillCreateView(LoginRequiredMixin, CreateView):
    model = SalesBill
    fields = ["customer"]
    template_name = "create_sales_bill.html"
    success_url = reverse_lazy("home")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["customer_form"] = CustomerForm()
        context["product_form"] = ProductForm()
        return context

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        self.object = form.save()

        for index in range(int(self.request.POST.get("items-TOTAL_FORMS", 0))):
            product_id = self.request.POST.get(f"items-{index}-product")
            quantity_str = self.request.POST.get(f"items-{index}-quantity")
            is_deleted = self.request.POST.get(f"items-{index}-DELETE") == "on"

            if product_id and quantity_str and not is_deleted:
                try:
                    quantity = int(quantity_str)
                    if quantity > 0:
                        SalesBillItem.objects.create(
                            bill=self.object,
                            product=Product.objects.get(id=int(product_id)),
                            quantity=quantity,
                        )
                except (Product.DoesNotExist, ValueError):
                    pass

        self.object.update_total()
        messages.success(
            self.request, f"Sales Bill #{self.object.id} Created Successfully!"
        )
        transaction.on_commit(lambda: generate_pdf_and_send_email.delay(self.object.id))
        return redirect(self.success_url)
