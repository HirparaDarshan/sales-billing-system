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
        errorElement: "small",
        submitHandler: function(form) {
            // AJAX POST
            $.ajax({
                url: "/api/products/",
                type: "POST",
                data: {
                    name: $("#id_name").val(),
                    price: $("#id_price").val()
                },
                headers: { "X-CSRFToken": $("input[name=csrfmiddlewaretoken]").val() },
                success: function(data){
                    alert("Product Created Successfully! ID: " + data.id);
                    $("#productForm")[0].reset();
                },
                error: function(xhr){
                    let err = xhr.responseJSON;
                    if(err && err.name){
                        alert("Error: " + err.name);
                    } else {
                        alert("Something went wrong!");
                    }
                }
            });

            return false;
        }
    });

});
