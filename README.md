# Sales Billing System

Django-based Sales Billing System with the following features:

- User authentication (Login/Register)  
- Customer management (Create, List)  
- Product management (Create, List)  
- Sales Bill creation with dynamic product rows, quantity, total calculation  
- Review modal before submission  

## Tech Stack

- Backend: Django, MySQL  
- Frontend: Bootstrap 5, jQuery  
- Version Control: Git, GitHub  

## Setup

1. Clone repository:  
bash
git clone https://github.com/<your-username>/sales-billing-system.git

2. Create virtual environment:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

3. Configure MySQL in settings.py

4. Run migrations:
python manage.py migrate


5. Create superuser:
python manage.py createsuperuser

6. Run server:
python manage.py runserver

## Features
- Typeahead dropdown for Customer and Product selection
- Dynamic "Add More Products" button
- Review Bill modal with total calculation
- Bootstrap UI styling

