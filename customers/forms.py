from django import forms

from customers.models import Customer


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ["name", "email", "address", "customer_type", "mobile"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "email": forms.EmailInput(attrs={"class": "form-control"}),
            "address": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "customer_type": forms.Select(attrs={"class": "form-select"}),
            "mobile": forms.TextInput(attrs={"class": "form-control"}),
        }

    def clean_name(self):
        name = self.cleaned_data.get("name")
        qs = Customer.objects.filter(name__iexact=name)

        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise forms.ValidationError("Customer with this name already exists.")

        return name

    def clean_mobile(self):
        mobile = self.cleaned_data.get("mobile")
        qs = Customer.objects.filter(mobile=mobile)

        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise forms.ValidationError("Customer with this mobile already exists.")

        if not mobile.isdigit():
            raise forms.ValidationError("Mobile must contain only numbers.")

        if len(mobile) != 10:
            raise forms.ValidationError("Mobile must be 10 digits.")

        return mobile

    def clean_email(self):
        email = self.cleaned_data.get("email")

        if email:
            qs = Customer.objects.filter(email__iexact=email)

            if self.instance.pk:
                qs = qs.exclude(pk=self.instance.pk)

            if qs.exists():
                raise forms.ValidationError("Customer with this email already exists.")

        return email
