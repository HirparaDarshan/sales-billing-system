from django.urls import path

from customers.views import CustomerCreateView

urlpatterns = [
    path("create-customer/", CustomerCreateView.as_view(), name="create_customer"),
]
