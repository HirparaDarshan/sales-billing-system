from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.shortcuts import redirect
from django.db import transaction
from sales.tasks import generate_pdf_and_send_email


from customers.models import Customer
from products.models import Product
from sales.models import SalesBill, SalesBillItem


class SalesBillCreateView(LoginRequiredMixin, CreateView):
    model = SalesBill
    fields = ["customer"]
    template_name = "create_sales_bill.html"
    success_url = reverse_lazy("home")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["customers"] = Customer.objects.all()
        context["products"] = Product.objects.all()
        return context

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        self.object = form.save()

        index = 0
        while True:
            product_key = f"items-{index}-product"
            quantity_key = f"items-{index}-quantity"
            delete_key = f"items-{index}-DELETE"

            if product_key not in self.request.POST:
                break

            product_id = self.request.POST.get(product_key)
            quantity_str = self.request.POST.get(quantity_key)
            is_deleted = self.request.POST.get(delete_key) == "on"

            if product_id and quantity_str and not is_deleted:
                try:
                    product = Product.objects.get(id=int(product_id))
                    quantity = int(quantity_str)
                    if quantity > 0:
                        SalesBillItem.objects.create(
                            bill=self.object,
                            product=product,
                            quantity=quantity,
                        )
                except (Product.DoesNotExist, ValueError):
                    pass

            index += 1

        self.object.update_total()
        messages.success(
            self.request, f"Sales Bill #{self.object.id} Created Successfully!"
        )
        transaction.on_commit(lambda: generate_pdf_and_send_email.delay(self.object.id))

        return redirect(self.success_url)
