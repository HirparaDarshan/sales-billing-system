$(document).ready(function () {
    let formIndex = 0;

    // ---------------------------
    // Load Customers
    // ---------------------------
    function loadCustomers(selectElement) {
        $.ajax({
            url: "/api/customers/",
            type: "GET",
            success: function(data){
                selectElement.empty().append('<option></option>');
                $.each(data, function(_, customer){
                    selectElement.append('<option value="'+customer.id+'">'+customer.name+'</option>');
                });
                selectElement.select2({ width: "100%", placeholder: "Search Customer..." });
            },
            error: function(){ alert("Customer API load failed"); }
        });
    }

    // ---------------------------
    // Load Products
    // ---------------------------
    function loadProducts(selectElement){
        $.ajax({
            url: "/api/products/",
            type: "GET",
            success: function(data){
                selectElement.empty().append('<option></option>');
                $.each(data, function(_, product){
                    selectElement.append('<option value="'+product.id+'" data-price="'+product.price+'">'+product.name+'</option>');
                });
                selectElement.select2({ width: "100%", placeholder: "Select Product" });
            },
            error: function(){ alert("Product API load failed"); }
        });
    }

    // Initialize Customer dropdown
    loadCustomers($(".select2-customer"));

    // ---------------------------
    // Add Product Row
    // ---------------------------
    function addNewProduct() {
        let template = $("#product-template").clone().removeAttr("id").removeClass("d-none").addClass("product-row");
        template.find("[name]").each(function () {
            let name = $(this).attr("name");
            if(name) $(this).attr("name", name.replace("__prefix__", formIndex));
        });
        formIndex++;
        $("#id_items-TOTAL_FORMS").val(formIndex);
        $("#product-container").append(template);
        loadProducts(template.find(".product-select"));
    }

    addNewProduct(); // first row
    $("#add-product").click(addNewProduct);

    // ---------------------------
    // Remove Product Row
    // ---------------------------
    $(document).on("click", ".remove-product", function () {
        if($(".product-row").length > 1){
            $(this).closest(".product-row").remove();
            updateSummary();
        }
    });

    // ---------------------------
    // Update product price & subtotal
    // ---------------------------
    function updateProduct(row){
        let productVal = row.find(".product-select").val();
        let price = parseFloat(row.find(".product-select option:selected").data("price")) || 0;
        let qty = parseInt(row.find(".qty-input").val()) || 0;
        row.find(".price-cell").text("₹" + price.toFixed(2));
        row.find(".subtotal-cell").text("₹" + (price * qty).toFixed(2));

        // Auto remove new rows if product empty
        if(!productVal && $(".product-row").index(row) !== 0 && $(".product-row").length>1){
            row.remove();
        }
    }

    // ---------------------------
    // Update bill summary
    // ---------------------------
    function updateSummary(){
        let total = 0, items = 0;
        $(".product-row").each(function(){
            let subtotal = parseFloat($(this).find(".subtotal-cell").text().replace("₹","")) || 0;
            if(subtotal>0) items++;
            total += subtotal;
        });
        $("#total-items").text(items);
        $("#grand-total").text("₹"+total.toFixed(2));
    }

    // ---------------------------
    // On change / keyup events
    // ---------------------------
    $(document).on("change keyup", ".product-select, .qty-input, .select2-customer", function(){
        let row = $(this).closest(".product-row");
        updateProduct(row);
        updateSummary();

        // Hide errors dynamically
        if($(this).hasClass("qty-input") && parseInt($(this).val())>0) $(this).siblings(".qty-error").text("");
        if($(this).hasClass("product-select") && $(this).val()) $(this).siblings(".product-error").text("");
        if($(this).hasClass("select2-customer") && $(this).val()) $(".customer-error").text("");
    });


    // ---------------------------
    // Handle newly created customer
    // ---------------------------
    $(document).on("customerCreated", function(event, customer){
        let newOption = new Option(customer.name, customer.id, true, true);

        $(".select2-customer")
            .append(newOption)
            .trigger('change');

        showToast(`Customer "${customer.name}" created successfully!`);
    });

    // ---------------------------
    // Handle newly created product
    // ---------------------------
    $(document).on("productCreated", function(event, product){
        $(".product-select").each(function(){
            let newOption = new Option(product.name, product.id, false, false);
             $(newOption).attr("data-price", product.price);
             $(this).append(newOption);
        });
        showToast(`Product "${product.name}" created successfully!`);
    });

    // ---------------------------
    // Toast helper
    // ---------------------------
    function showToast(message){
        let toastHtml = `
            <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        $("body").append(toastHtml);
        let toastEl = document.querySelector('.toast:last-child');
        new bootstrap.Toast(toastEl).show();
        toastEl.addEventListener('hidden.bs.toast', function(){ $(this).remove(); });
    }

    // ---------------------------
    // Review Bill Modal
    // ---------------------------
    $("#review-bill").click(function () {
        let anyProductAdded = false;
        let total = 0;
        let tableRows = "";
        let reviewModalEl = document.getElementById("reviewModal");
        if(!reviewModalEl){ alert("Review Modal not found!"); return; }

        $(".product-row").each(function(index){
            let productVal = $(this).find(".product-select").val();
            // Remove empty new rows except first
            if(index !== 0 && !productVal){
                $(this).remove();
            }
        });

        let hasError = false;
        $("#bill-form .text-danger").text("");
        let modalBody = $("#modal-body").empty();

        // Customer validation
        let customerSelect = $(".select2-customer");
        let customerVal = customerSelect.val();
        let customerName = customerSelect.find("option:selected").text();
        if(!customerVal){ $(".customer-error").text("Please select customer."); hasError=true; }

        // Products validation

        $(".product-row").each(function(index){
            let product = $(this).find(".product-select");
            let qtyInput = $(this).find(".qty-input");
            let productVal = product.val();
            let qty = parseInt(qtyInput.val());
            let price = parseFloat(product.find("option:selected").data("price")) || 0;

            if(index===0){ // First row
                if(!productVal){
                    $(this).find(".product-error").text("Please select product");
                    hasError=true;
                } else {
                    $(this).find(".product-error").text(""); // clear product error if selected
                }
                if(!qty || qty<=0){
                    $(this).find(".qty-error").text("Please enter quantity");
                    hasError=true;
                } else {
                    $(this).find(".qty-error").text("");
                }
            } else { // New rows
                if(!productVal){
                    $(this).remove(); // auto remove empty new rows
                } else {
                    if(!qty || qty<=0){
                        $(this).find(".qty-error").text("Please enter quantity");
                        hasError=true;
                    } else {
                        $(this).find(".qty-error").text("");
                    }
                }
            }

            if(productVal && qty>0){
                anyProductAdded=true;
                let subtotal = qty*price;
                total += subtotal;
                tableRows += `<tr><td>${index+1}</td><td>${product.find("option:selected").text()}</td><td>${qty}</td><td>₹${subtotal.toFixed(2)}</td></tr>`;
            }
        });

        if(!anyProductAdded){ $(".product-error:first").text("Please add at least one product."); return; }
        if(hasError) return;

        modalBody.append(`
            <h6 class="mb-3"><strong>Customer:</strong> ${customerName}</h6>
            <table class="table table-bordered text-center">
                <thead class="table-dark"><tr><th>#</th><th>Product</th><th>Qty</th><th>Subtotal</th></tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        `);
        $("#modal-total").text("Grand Total: ₹" + total.toFixed(2));
        new bootstrap.Modal(reviewModalEl).show();
    });

    // ---------------------------
    // Submit final bill
    // ---------------------------
    $("#modal-submit").click(function(){ $("#bill-form").submit(); });

});
