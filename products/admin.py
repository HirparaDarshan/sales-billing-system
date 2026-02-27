from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from products.models import Product


class ProductAdmin(SimpleHistoryAdmin):
    list_display = ("name", "price", "created_by", "created_at", "modified_at")
    search_fields = ("name",)
    list_filter = ("created_at", "modified_at", "created_by")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_by",)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Product, ProductAdmin)
