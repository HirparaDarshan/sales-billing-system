from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView
from rest_framework import viewsets

from customers.serializers import CustomerSerializer
from customers.forms import CustomerForm
from customers.models import Customer


class CustomerCreateView(LoginRequiredMixin, CreateView):
    model = Customer
    form_class = CustomerForm
    template_name = "create_customer.html"
    success_url = reverse_lazy("home")

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, "Customer Created Successfully")
        return super().form_valid(form)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
