# Sales Billing System

A **Django-based Sales Billing System** to manage customers, products, and create sales bills dynamically. Designed for small businesses and shops, it features user authentication, responsive UI, dynamic invoice generation, and real-time bill calculation.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Requirements](#requirements)
* [Installation](#installation)
  * [1. Clone Repository](#1-clone-repository)
  * [2. Set Up Virtual Environment](#2-set-up-virtual-environment)
  * [3. Install Dependencies](#3-install-dependencies)
  * [4. Configure Database](#4-configure-database)
  * [5. Prepare Media Folder](#5-prepare-media-folder)
  * [6. Run Migrations](#6-run-migrations)
  * [7. Create Superuser](#7-create-superuser)
  * [8. Run Development Server](#8-run-development-server)
  * [9. Start Celery Worker](#9-start-celery-worker)
* [Usage](#usage)
  * [User Workflow](#user-workflow)
* [Project Structure](#project-structure)
* [Screenshots](#screenshots)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **User Authentication**: Login, Register, Logout  
* **Customer Management**: Add and list customers  
* **Product Management**: Add and list products  
* **Sales Bill Creation**:
  * Dynamic product rows  
  * Quantity & total calculation  
  * Review modal before submission  
  * Auto-generate invoice PDF (`invoice_<bill_id>.pdf`)  
  * Email invoice automatically after bill creation  
* **Search & Typeahead**: Quickly find customers and products  
* **Responsive UI**: Bootstrap 5 styling for desktop & mobile  

---

## Tech Stack

* **Backend**: Django 6.0, Python 3.11+  
* **Database**: MySQL  
* **Frontend**: Bootstrap 5, jQuery  
* **Background Tasks**: Celery + Redis  
* **Version Control**: Git, GitHub  

---

## Requirements

* Python 3.11+  
* MySQL Server  
* Git  
* Virtual Environment (`venv`)  
* Redis (for Celery background tasks)  

Dependencies are included in `requirements.txt`.

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/sales-billing-system.git
cd sales-billing-system
```

### 2. Set Up Virtual Environment

# Create virtualenv
python3 -m venv venv

# Activate venv (Linux/Mac)
source venv/bin/activate

# Activate venv (Windows)
venv\Scripts\activate

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Database

1. Create a MySQL database:

```sql
CREATE DATABASE salesdb;
```

2. Update `.env` file:

```env
DB_NAME=salesdb
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

3. Ensure `settings.py` loads these using `python-decouple`:

```python
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='3306'),
    }
}
```
### 5. Prepare Media Folder
# Create media folder for uploads and invoices
mkdir -p media/invoices


### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

### 8. Run Development Server

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in your browser.

---

### 9. Start Celery Worker
```bash
celery -A salesproject worker --loglevel=info
```

## Usage

### User Workflow

1. **Register / Login**
2. **Customer Management**: Add customers → Fill details → Save
3. **Product Management**: Add products → Fill details → Save
4. **Create Sales Bill**:

   * Select customer from typeahead dropdown
   * Add products dynamically
   * Review bill in modal before submission
   * Click Confirm → bill saved, PDF generated as invoice_<bill_id>.pdf, and emailed automatically

> 💡 Total price is automatically calculated as products are added.

---

## Project Structure

sales-billing-system/
│
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
├── media/               # Uploads & invoice PDFs (not tracked by Git)
│   └── invoices/
├── salesproject/        # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── customers/           # Customer app
├── products/            # Product app
├── sales/               # Sales app (billing, PDF, email)
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── tasks.py         # Celery tasks for PDF/email
│   ├── templates/
│   │   ├── base.html
│   │   └── invoice_pdf.html
│   └── static/
└── accounts/            # Authentication, CSS/JS files

---


## Contributing

1. Fork repository
2. Create new branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push branch (`git push origin feature/xyz`)
5. Open a Pull Request

---
