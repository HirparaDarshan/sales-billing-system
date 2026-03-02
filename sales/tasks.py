from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from weasyprint import HTML
from django.conf import settings
from sales.models import SalesBill
import os


@shared_task
def generate_pdf_and_send_email(bill_id):
    bill = SalesBill.objects.get(id=bill_id)

    # Render HTML template
    html_string = render_to_string("sales/invoice_pdf.html", {"bill": bill})

    # Ensure invoices folder exists
    invoices_dir = os.path.join(settings.MEDIA_ROOT, "invoices")
    os.makedirs(invoices_dir, exist_ok=True)

    # Set filename exactly as invoice_<bill.id>.pdf
    invoice_filename = f"invoice_{bill.id}.pdf"
    invoice_path = os.path.join(invoices_dir, invoice_filename)

    # Generate PDF and save locally with exact filename
    HTML(string=html_string).write_pdf(target=invoice_path)

    # Send email with the same PDF
    email = EmailMessage(
        subject=f"Invoice #{bill.id}",
        body="Please find attached your invoice PDF.",
        to=[bill.customer.email],
    )
    email.attach_file(invoice_path)
    email.send()
