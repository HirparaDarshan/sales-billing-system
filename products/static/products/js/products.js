$(document).ready(function () {

    // ---------------------------
    // Product Modal Validation
    // ---------------------------
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
        errorPlacement: function(error, element) {
            $("#product_error_" + element.attr("name")).html(error);
        },
        submitHandler: function(form) {
            $.ajax({
                url: "/api/products/",
                type: "POST",
                data: $(form).serialize(),
                headers: { "X-CSRFToken": $("input[name=csrfmiddlewaretoken]").val() },
                success: function(data){
                    // Reset form & hide modal
                    $("#productModalForm")[0].reset();
                    $("#createProductModal").modal("hide");

                    // Trigger event for salesbill.js to update dropdown
                    $(document).trigger("productCreated", [data]);
                },
                error: function(xhr){
                    let err = xhr.responseJSON;
                    $("#productModalForm .text-danger").text("");
                    if(err){
                        for(let key in err){
                            let messages = Array.isArray(err[key]) ? err[key].join(", ") : err[key];
                            $("#product_error_" + key).text(messages);
                        }
                    } else {
                        showToast("Something went wrong!", "danger");
                    }
                }
            });
            return false;
        }
    });

    // ---------------------------
    // Reset modal form when closed
    // ---------------------------
    $('#createProductModal').on('hidden.bs.modal', function () {
        $("#productModalForm")[0].reset();
        $(".text-danger").html('');
    });

    // ---------------------------
    // Show toast helper
    // ---------------------------
    function showToast(message, type="success"){
        let toastHtml = `
        <div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>`;
        $("body").append(toastHtml);
        let toastEl = document.querySelector('.toast:last-child');
        let bsToast = new bootstrap.Toast(toastEl);
        bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', function(){ $(this).remove(); });
    }

});
