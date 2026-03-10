from rest_framework import serializers
from products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "slug", "price", "created_at", "modified_at"]
        read_only_fields = ["slug", "created_at", "modified_at"]
