from django.contrib.auth.models import User
from django.db import models

from customers.models import Customer
from products.models import Product


class SalesBill(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bill #{self.id}"

    def update_total(self):
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save()


class SalesBillItem(models.Model):
    bill = models.ForeignKey(SalesBill, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return self.product.name

    def save(self, *args, **kwargs):
        self.price = self.product.price
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)
