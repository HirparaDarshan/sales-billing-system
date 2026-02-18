from django import forms
from core.models import Customer, Product
from django.forms import ModelForm, inlineformset_factory
from core.models import SalesBill, SalesBillItem


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ["name", "address", "customer_type", "mobile"]

        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "address": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "customer_type": forms.Select(attrs={"class": "form-control"}),
            "mobile": forms.TextInput(attrs={"class": "form-control"}),
        }


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "price"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "price": forms.NumberInput(attrs={"class": "form-control"}),
        }


class SalesBillItemForm(ModelForm):
    class Meta:
        model = SalesBillItem
        fields = ["product", "quantity"]
        widgets = {
            "product": forms.Select(attrs={"class": "form-control product-select"}),
            "quantity": forms.NumberInput(
                attrs={"class": "form-control qty-input", "min": "1"}
            ),
        }


# Inline formset for SalesBillItem linked to SalesBill
SalesBillItemFormSet = inlineformset_factory(
    SalesBill, SalesBillItem, form=SalesBillItemForm, extra=1, can_delete=True
)
