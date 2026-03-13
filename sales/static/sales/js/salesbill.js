$(document).ready(function () {
    let formIndex = 0;

    function loadCustomers(selectElement) {
        $.ajax({
            url: "/api/customers/",
            type: "GET",
            success: function (data) {
                selectElement.empty().append("<option></option>");
                $.each(data, function (_, c) {
                    selectElement.append('<option value="' + c.id + '">' + c.name + "</option>");
                });
                selectElement.select2({ width: "100%", placeholder: "Search Customer..." });
            },
            error: function () { showToast("Customer API load failed", "danger"); }
        });
    }

    function loadProducts(selectElement) {
        $.ajax({
            url: "/api/products/",
            type: "GET",
            success: function (data) {
                selectElement.empty().append("<option></option>");
                $.each(data, function (_, p) {
                    selectElement.append('<option value="' + p.id + '" data-price="' + p.price + '">' + p.name + "</option>");
                });
                selectElement.select2({ width: "100%", placeholder: "Select Product" });
            },
            error: function () { showToast("Product API load failed", "danger"); }
        });
    }

    loadCustomers($(".select2-customer"));

    function addNewProduct() {
        let template = $("#product-template").clone().removeAttr("id").removeClass("d-none").addClass("product-row");
        template.find("[name]").each(function () {
            let name = $(this).attr("name");
            if (name) $(this).attr("name", name.replace("__prefix__", formIndex));
        });
        formIndex++;
        $("#id_items-TOTAL_FORMS").val(formIndex);
        $("#product-container").append(template);
        loadProducts(template.find(".product-select"));
    }

    addNewProduct();
    $("#add-product").click(addNewProduct);

    $(document).on("click", ".remove-product", function () {
        if ($(".product-row").length > 1) {
            $(this).closest(".product-row").remove();
            updateSummary();
        }
    });

    function updateProduct(row) {
        let price = parseFloat(row.find(".product-select option:selected").data("price")) || 0;
        let qty = parseInt(row.find(".qty-input").val()) || 0;
        row.find(".price-cell").text("₹" + price.toFixed(2));
        row.find(".subtotal-cell").text("₹" + (price * qty).toFixed(2));
    }

    function updateSummary() {
        let total = 0, items = 0;
        $(".product-row").each(function () {
            let subtotal = parseFloat($(this).find(".subtotal-cell").text().replace("₹", "")) || 0;
            if (subtotal > 0) items++;
            total += subtotal;
        });
        $("#total-items").text(items);
        $("#grand-total").text("₹" + total.toFixed(2));
    }

    $(document).on("change keyup", ".product-select, .qty-input, .select2-customer", function () {
        let row = $(this).closest(".product-row");
        updateProduct(row);
        updateSummary();
        if ($(this).hasClass("qty-input") && parseInt($(this).val()) > 0) $(this).siblings(".qty-error").text("");
        if ($(this).hasClass("product-select") && $(this).val()) $(this).siblings(".product-error").text("");
        if ($(this).hasClass("select2-customer") && $(this).val()) $(".customer-error").text("");
    });

    $(document).on("customerCreated", function (event, customer) {
        $(".select2-customer").append(new Option(customer.name, customer.id, true, true)).trigger("change");
    });

    $(document).on("productCreated", function (event, product) {
        $(".product-select").each(function () {
            let opt = new Option(product.name, product.id, false, false);
            $(opt).attr("data-price", product.price);
            $(this).append(opt);
        });
    });

    $("#review-bill").click(function () {
        // Clean up empty non-first rows
        $(".product-row").each(function (index) {
            if (index !== 0 && !$(this).find(".product-select").val()) $(this).remove();
        });

        let hasError = false;
        let total = 0, tableRows = "";
        $("#bill-form .text-danger").text("");

        let customerVal = $(".select2-customer").val();
        let customerName = $(".select2-customer option:selected").text();
        if (!customerVal) { $(".customer-error").text("Please select customer."); hasError = true; }

        $(".product-row").each(function (index) {
            let product = $(this).find(".product-select");
            let qtyInput = $(this).find(".qty-input");
            let productVal = product.val();
            let qty = parseInt(qtyInput.val());
            let price = parseFloat(product.find("option:selected").data("price")) || 0;

            if (index === 0) {
                if (!productVal) { $(this).find(".product-error").text("Please select product"); hasError = true; }
                if (!qty || qty <= 0) { $(this).find(".qty-error").text("Please enter quantity"); hasError = true; }
            } else {
                if (!productVal) { $(this).remove(); return; }
                if (!qty || qty <= 0) { $(this).find(".qty-error").text("Please enter quantity"); hasError = true; }
            }

            if (productVal && qty > 0) {
                let subtotal = qty * price;
                total += subtotal;
                tableRows += "<tr><td>" + (index + 1) + "</td><td>" + product.find("option:selected").text() + "</td><td>" + qty + "</td><td>₹" + subtotal.toFixed(2) + "</td></tr>";
            }
        });

        if (!tableRows) { $(".product-error:first").text("Please add at least one product."); return; }
        if (hasError) return;

        $("#modal-body").html(
            '<h6 class="mb-3"><strong>Customer:</strong> ' + customerName + "</h6>" +
            '<table class="table table-bordered text-center">' +
            '<thead class="table-dark"><tr><th>#</th><th>Product</th><th>Qty</th><th>Subtotal</th></tr></thead>' +
            "<tbody>" + tableRows + "</tbody></table>"
        );
        $("#modal-total").text("Grand Total: ₹" + total.toFixed(2));
        new bootstrap.Modal(document.getElementById("reviewModal")).show();
    });

    $("#modal-submit").click(function () { $("#bill-form").submit(); });

});
