from django.urls import path

from .views import SalesBillCreateView

urlpatterns = [
    path("create-sales-bill/", SalesBillCreateView.as_view(), name="create_sales_bill"),
]
