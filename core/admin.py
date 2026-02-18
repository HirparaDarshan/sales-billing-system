from django.contrib import admin
from core.models import Customer, Product, SalesBill, SalesBillItem

admin.site.register(Customer)
admin.site.register(Product)
admin.site.register(SalesBill)
admin.site.register(SalesBillItem)
