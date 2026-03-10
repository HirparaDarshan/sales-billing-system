from rest_framework import serializers
from customers.models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "slug", "email", "mobile", "customer_type"]
        read_only_fields = ["slug"]
