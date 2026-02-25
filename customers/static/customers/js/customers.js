$(document).ready(function () {

    $("#customerForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true
            },
            mobile: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            customer_type: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please enter customer name",
                minlength: "Name must be at least 3 characters"
            },
            email: {
                required: "Please enter email address",
                email: "Please enter a valid email address (example: name@gmail.com)"
            },
            mobile: {
                required: "Please enter mobile number",
                digits: "Only numbers allowed",
                minlength: "Mobile must be 10 digits",
                maxlength: "Mobile must be 10 digits"
            },
            customer_type: {
                required: "Please select customer type"
            }
        },
        errorClass: "text-danger",
        errorElement: "small"
    });

});
