from django import forms
from django.forms import ModelForm, inlineformset_factory

from sales.models import SalesBill, SalesBillItem


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

    def clean_product(self):
        product = self.cleaned_data.get("product")
        if not product:
            raise forms.ValidationError("Product must be selected.")
        return product

    def clean_quantity(self):
        quantity = self.cleaned_data.get("quantity")
        if quantity is None or quantity <= 0:
            raise forms.ValidationError("Quantity must be greater than zero.")
        return quantity


SalesBillItemFormSet = inlineformset_factory(
    SalesBill,
    SalesBillItem,
    form=SalesBillItemForm,
    extra=1,
    can_delete=True,
)
