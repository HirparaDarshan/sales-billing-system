from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from customers.models import Customer


class CustomerAdmin(SimpleHistoryAdmin):
    list_display = (
        "name",
        "email",
        "mobile",
        "customer_type",
        "created_by",
        "created_at",
        "modified_at",
    )
    search_fields = ("name", "mobile", "email", "address")
    list_filter = ("customer_type", "created_at", "modified_at", "created_by")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_by",)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Customer, CustomerAdmin)
