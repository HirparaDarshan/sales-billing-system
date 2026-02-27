from django import forms

from products.models import Product


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
        qs = Product.objects.filter(name__iexact=name)

        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise forms.ValidationError("Product with this name already exists.")

        return name

    def clean_price(self):
        price = self.cleaned_data.get("price")

        if price is None or price <= 0:
            raise forms.ValidationError("Price must be greater than zero.")

        return price
