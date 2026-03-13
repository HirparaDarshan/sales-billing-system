$(document).ready(function () {

    $("#productModalForm").validate({
        rules: {
            name: { required: true, minlength: 3 },
            price: { required: true, number: true, min: 0.01 }
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
        errorPlacement: function (error, element) {
            $("#product_error_" + element.attr("name")).html(error);
        },
        submitHandler: function (form) {
            $.ajax({
                url: "/api/products/",
                type: "POST",
                data: $(form).serialize(),
                success: function (data) {
                    $("#productModalForm")[0].reset();
                    $("#createProductModal").modal("hide");
                    $(document).trigger("productCreated", [data]);
                    showToast('Product "' + data.name + '" created successfully!');
                },
                error: function (xhr) {
                    let err = xhr.responseJSON;
                    $("#productModalForm .text-danger").text("");
                    if (err) {
                        for (let key in err) {
                            let msg = Array.isArray(err[key]) ? err[key].join(", ") : err[key];
                            $("#product_error_" + key).text(msg);
                        }
                    } else {
                        showToast("Something went wrong!", "danger");
                    }
                }
            });
            return false;
        }
    });

    $("#createProductModal").on("hidden.bs.modal", function () {
        $("#productModalForm")[0].reset();
        $(".text-danger").html("");
    });

});
