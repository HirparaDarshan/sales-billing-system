from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from simple_history.models import HistoricalRecords


class Customer(models.Model):
    CUSTOMER_TYPE = (
        ("Retail", "Retail"),
        ("Wholesale", "Wholesale"),
    )

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    email = models.EmailField(unique=True)
    address = models.TextField(blank=True, null=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPE)
    mobile = models.CharField(max_length=15, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    history = HistoricalRecords()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
