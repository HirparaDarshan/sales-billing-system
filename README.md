# Sales Billing System

A **Django-based Sales Billing System** to manage customers, products, and create sales bills dynamically. Designed for small businesses and shops, it features user authentication, responsive UI, and real-time bill calculation.

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
  * [5. Run Migrations](#5-run-migrations)
  * [6. Create Superuser](#6-create-superuser)
  * [7. Run Development Server](#7-run-development-server)
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
* **Search & Typeahead**: Quickly find customers and products
* **Responsive UI**: Bootstrap 5 styling for desktop & mobile

---

## Tech Stack

* **Backend**: Django 6.0, Python 3.11+
* **Database**: MySQL
* **Frontend**: Bootstrap 5, jQuery
* **Version Control**: Git, GitHub

---

## Requirements

* Python 3.11+
* MySQL Server
* Git
* Virtual Environment (`venv`)

Dependencies are included in `requirements.txt`.

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/sales-billing-system.git
cd sales-billing-system
```

### 2. Set Up Virtual Environment

```bash
# Create venv
python3 -m venv venv

# Activate venv (Linux/Mac)
source venv/bin/activate

# Activate venv (Windows)
venv\Scripts\activate
```

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

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in your browser.

---

## Usage

### User Workflow

1. **Register / Login**
2. **Customer Management**: Add customers → Fill details → Save
3. **Product Management**: Add products → Fill details → Save
4. **Create Sales Bill**:

   * Select customer from typeahead dropdown
   * Add products dynamically
   * Review bill in modal before submission
   * Submit to save bill

> 💡 Total price is automatically calculated as products are added.

---

## Project Structure

```text
sales-billing-system/
│
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
├── sales_billing_system/  # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── app/  # Django app for billing
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── customer_list.html
│   │   ├── product_list.html
│   │   └── bill_create.html
│   └── static/
└── README.md
```

---


## Contributing

1. Fork repository
2. Create new branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push branch (`git push origin feature/xyz`)
5. Open a Pull Request

---
