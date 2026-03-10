from django.urls import path

from products.views import ProductCreateView

urlpatterns = [
    path("create-product/", ProductCreateView.as_view(), name="create_product"),
]
