from django.contrib import admin

from sales.models import SalesBill, SalesBillItem


class SalesBillItemInline(admin.TabularInline):
    model = SalesBillItem
    extra = 1
    readonly_fields = ("subtotal", "price")
    autocomplete_fields = ["product"]


class SalesBillAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "created_by", "total_amount", "created_at")
    search_fields = ("customer__name", "created_by__username")
    autocomplete_fields = ["customer"]
    list_filter = ("created_at", "created_by", "customer")
    inlines = [SalesBillItemInline]
    readonly_fields = ("total_amount", "created_by")

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def has_change_permission(self, request, obj=None):
        return False


admin.site.register(SalesBill, SalesBillAdmin)
