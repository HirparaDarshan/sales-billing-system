from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView

from products.forms import ProductForm
from products.models import Product
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from products.serializers import ProductSerializer


class ProductCreateView(LoginRequiredMixin, CreateView):
    model = Product
    form_class = ProductForm
    template_name = "create_product.html"
    success_url = reverse_lazy("home")

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, "Product Created Successfully")
        return super().form_valid(form)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
