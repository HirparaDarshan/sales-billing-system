from django import forms
from django.forms import ModelForm, inlineformset_factory
from core.models import Customer, Product, SalesBill, SalesBillItem


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

    def clean_name(self):
        name = self.cleaned_data.get("name")
        if Customer.objects.filter(name__iexact=name).exists():
            raise forms.ValidationError("Customer with this name already exists.")
        return name

    def clean_mobile(self):
        mobile = self.cleaned_data.get("mobile")
        if Customer.objects.filter(mobile=mobile).exists():
            raise forms.ValidationError("Customer with this mobile already exists.")
        return mobile


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "price"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "price": forms.NumberInput(attrs={"class": "form-control"}),
        }

    def clean_name(self):
        name = self.cleaned_data.get("name")
        if Product.objects.filter(name__iexact=name).exists():
            raise forms.ValidationError("Product with this name already exists.")
        return name

    def clean_price(self):
        price = self.cleaned_data.get("price")
        if price is None or price <= 0:
            raise forms.ValidationError("Price must be greater than zero.")
        return price


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
    SalesBill, SalesBillItem, form=SalesBillItemForm, extra=1, can_delete=True
)
