from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView

from .forms import ProductForm
from .models import Product


class ProductCreateView(LoginRequiredMixin, CreateView):
    model = Product
    form_class = ProductForm
    template_name = "create_product.html"
    success_url = reverse_lazy("home")

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, "Product Created Successfully")
        return super().form_valid(form)
