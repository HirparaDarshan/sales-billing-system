$(document).ready(function () {

    $("#productForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 3
            },
            price: {
                required: true,
                number: true,
                min: 0.01
            }
        },
        messages: {
            name: {
                required: "Please enter product name",
                minlength: "Product name must be at least 3 characters"
            },
            price: {
                required: "Please enter price",
                number: "Please enter a valid number",
                min: "Price must be greater than 0"
            }
        },
        errorClass: "text-danger",
        errorElement: "small"
    });

});
