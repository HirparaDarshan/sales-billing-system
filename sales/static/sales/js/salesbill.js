$(document).ready(function () {
    let formIndex = 0;

    // ---------------------------
    // 1️⃣ Load Customers from API
    // ---------------------------
    function loadCustomers(selectElement) {
        $.ajax({
            url: "/api/customers/",
            type: "GET",
            success: function(data){
                selectElement.empty();
                selectElement.append('<option></option>'); // placeholder

                $.each(data, function(index, customer){
                    selectElement.append(
                        '<option value="'+customer.id+'">'+customer.name+'</option>'
                    );
                });

                // Initialize select2 after options are loaded
                selectElement.select2({
                    width: "100%",
                    placeholder: "Search Customer..."
                });
            },
            error: function(){
                alert("Customer API load failed");
            }
        });
    }

    // ---------------------------
    // 2️⃣ Load Products from API
    // ---------------------------
    function loadProducts(selectElement){
        $.ajax({
            url: "/api/products/",
            type: "GET",
            success: function(data){
                selectElement.empty();
                selectElement.append('<option></option>'); // placeholder

                $.each(data, function(index, product){
                    selectElement.append(
                        '<option value="'+product.id+'" data-price="'+product.price+'">'+product.name+'</option>'
                    );
                });

                // Initialize select2 after options loaded
                selectElement.select2({
                    width: "100%",
                    placeholder: "Select Product"
                });
            },
            error: function(){
                alert("Product API load failed");
            }
        });
    }

    // ---------------------------
    // 3️⃣ Initialize Customer Dropdown
    // ---------------------------
    loadCustomers($(".select2-customer"));

    // ---------------------------
    // 4️⃣ Add New Product Row
    // ---------------------------
    function addNewProduct() {
        let template = $("#product-template").clone();
        template.removeAttr("id");
        template.removeClass("d-none");
        template.addClass("product-row");

        // Update input names
        template.find("[name]").each(function () {
            let name = $(this).attr("name");
            if (name) {
                $(this).attr("name", name.replace("__prefix__", formIndex));
            }
        });

        formIndex++;
        $("#id_items-TOTAL_FORMS").val(formIndex);

        $("#product-container").append(template);

        // Load products via API for this row
        let select = template.find(".product-select");
        loadProducts(select);
    }

    // Add first row on page load
    addNewProduct();

    // Add new row on click
    $("#add-product").click(function () {
        addNewProduct();
    });

    // ---------------------------
    // 5️⃣ Remove Product Row
    // ---------------------------
    $(document).on("click", ".remove-product", function () {
        if ($(".product-row").length > 1) {
            $(this).closest(".product-row").remove();
            updateSummary();
        }
    });

    // ---------------------------
    // 6️⃣ Update Product Price & Subtotal
    // ---------------------------
    function updateProduct(row) {
        let price =
            parseFloat(row.find(".product-select option:selected").data("price")) || 0;

        let qty = parseInt(row.find(".qty-input").val()) || 0;

        row.find(".price-cell").text("₹" + price.toFixed(2));
        row.find(".subtotal-cell").text("₹" + (price * qty).toFixed(2));
    }

    // ---------------------------
    // 7️⃣ Update Bill Summary
    // ---------------------------
    function updateSummary() {
        let total = 0;
        let items = 0;

        $(".product-row").each(function () {
            let subtotal =
                parseFloat($(this).find(".subtotal-cell").text().replace("₹", "")) || 0;

            if (subtotal > 0) items++;
            total += subtotal;
        });

        $("#total-items").text(items);
        $("#grand-total").text("₹" + total.toFixed(2));
    }

    // Trigger update on product or qty change
    $(document).on("change keyup", ".product-select, .qty-input", function () {
        let row = $(this).closest(".product-row");
        updateProduct(row);
        updateSummary();
    });

    // ---------------------------
    // 8️⃣ Review Modal + Validation
    // ---------------------------
    $("#review-bill").click(function () {
        let hasError = false;
        $(".text-danger").text("");
        let modalBody = $("#modal-body");
        modalBody.empty();

        // Customer validation
        let customerSelect = $(".select2-customer");
        let customerVal = customerSelect.val();
        let customerName = customerSelect.find("option:selected").text();

        if (!customerVal) {
            $(".customer-error").text("Please select customer.");
            hasError = true;
        }

        // Products validation & table
        let total = 0;
        let tableRows = "";
        let anyProductAdded = false;
        let productRows = $(".product-row");

        productRows.each(function (index) {
            let product = $(this).find(".product-select");
            let qtyInput = $(this).find(".qty-input");

            let productVal = product.val();
            let productName = product.find("option:selected").text();
            let qty = parseInt(qtyInput.val());
            let price = parseFloat(product.find("option:selected").data("price")) || 0;

            if (!productVal) {
                $(this).find(".product-error").text("Please select a product");
                hasError = true;
            }

            if (!qty || qty <= 0) {
                $(this).find(".qty-error").text("Please enter quantity");
                hasError = true;
            }

            if (productVal && qty > 0) {
                anyProductAdded = true;
                let subtotal = qty * price;
                total += subtotal;

                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${productName}</td>
                        <td>${qty}</td>
                        <td>₹${subtotal.toFixed(2)}</td>
                    </tr>
                `;
            }
        });

        if (!anyProductAdded) {
            $(".product-error:first").text("Please add at least one product.");
            return;
        }

        if (hasError) return;

        modalBody.append(`
            <h6 class="mb-3"><strong>Customer:</strong> ${customerName}</h6>
            <table class="table table-bordered text-center">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `);

        $("#modal-total").text("Grand Total: ₹" + total.toFixed(2));

        new bootstrap.Modal(document.getElementById("reviewModal")).show();
    });

    // Submit form from modal
    $("#modal-submit").click(function () {
        $("#bill-form").submit();
    });
});
