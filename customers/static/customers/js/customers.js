$(document).ready(function () {

    const form = $("#customerModalForm");

    function ensureCustomerTypeOptions() {
        let select = form.find("select[name='customer_type']");
        if (select.find("option").length <= 1) {
            select.empty()
                .append('<option value="">---------</option>')
                .append('<option value="Retail">Retail</option>')
                .append('<option value="Wholesale">Wholesale</option>');
        }
    }

    $("#customerModal").on("show.bs.modal", function () {
        ensureCustomerTypeOptions();
    });

    form.validate({
        rules: {
            name: { required: true, minlength: 3 },
            email: { required: true, email: true },
            mobile: { required: true, digits: true, minlength: 10, maxlength: 10 },
            customer_type: { required: true }
        },
        messages: {
            name: { required: "Please enter customer name", minlength: "Name must be at least 3 characters" },
            email: { required: "Please enter email", email: "Enter a valid email" },
            mobile: { required: "Enter mobile number", digits: "Only digits allowed", minlength: "Must be 10 digits", maxlength: "Must be 10 digits" },
            customer_type: { required: "Please select customer type" }
        },
        errorClass: "text-danger",
        errorElement: "small",
        errorPlacement: function (error, element) {
            $("#customer_error_" + element.attr("name")).html(error);
        },
        submitHandler: function () {
            $.ajax({
                url: "/api/customers/",
                type: "POST",
                data: form.serialize(),
                success: function (data) {
                    form[0].reset();
                    $("#customerModal").modal("hide");
                    $(document).trigger("customerCreated", [data]);
                    showToast('Customer "' + data.name + '" created successfully!');
                },
                error: function (xhr) {
                    let err = xhr.responseJSON;
                    form.find(".text-danger").empty();
                    if (err) {
                        for (let key in err) {
                            let msg = Array.isArray(err[key]) ? err[key].join(", ") : err[key];
                            $("#customer_error_" + key).html(msg);
                        }
                    } else {
                        showToast("Something went wrong!", "danger");
                    }
                }
            });
            return false;
        }
    });

    $("#customerModal").on("hidden.bs.modal", function () {
        form.validate().resetForm();
        form.find(".text-danger").empty();
        form[0].reset();
        ensureCustomerTypeOptions();
    });

});
