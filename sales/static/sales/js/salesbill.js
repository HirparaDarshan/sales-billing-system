$(document).ready(function () {
  let formIndex = 0;

  function initCustomerSelect() {
    $(".select2-customer").select2({
      width: "100%",
      placeholder: "Search Customer...",
    });
  }

  function initProductSelect(el) {
    el.select2({
      width: "100%",
      placeholder: "Select Product",
    });
  }

  initCustomerSelect();

  function addNewProduct() {
    let template = $("#product-template").clone();
    template.removeAttr("id");
    template.removeClass("d-none");
    template.addClass("product-row");

    template.find("[name]").each(function () {
      let name = $(this).attr("name");
      if (name) {
        $(this).attr("name", name.replace("__prefix__", formIndex));
      }
    });

    formIndex++;
    $("#id_items-TOTAL_FORMS").val(formIndex);

    $("#product-container").append(template);

    initProductSelect(template.find(".select2-product"));
  }

  addNewProduct();

  $("#add-product").click(function () {
    addNewProduct();
  });

  // Remove row
  $(document).on("click", ".remove-product", function () {
    if ($(".product-row").length > 1) {
      $(this).closest(".product-row").remove();
      updateSummary();
    }
  });

  function updateProduct(row) {
    let price =
      parseFloat(row.find(".product-select option:selected").data("price")) ||
      0;

    let qty = parseInt(row.find(".qty-input").val()) || 0;

    row.find(".price-cell").text("₹" + price.toFixed(2));
    row.find(".subtotal-cell").text("₹" + (price * qty).toFixed(2));
  }

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

  $(document).on("change keyup", ".product-select, .qty-input", function () {
    let row = $(this).closest(".product-row");
    updateProduct(row);
    updateSummary();
  });

  // REVIEW + VALIDATION
  $("#review-bill").click(function () {
    let hasError = false;
    $(".text-danger").text("");
    let modalBody = $("#modal-body");
    modalBody.empty();

    let customerSelect = $(".select2-customer");
    let customerVal = customerSelect.val();
    let customerName = customerSelect.find("option:selected").text();

    if (!customerVal) {
        $(".customer-error").text("Please select customer.");
        hasError = true;
    }

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

        if (productRows.length > 1) {
            // Multiple rows: remove empty rows automatically
            if (!productVal && (!qty || qty <= 0)) {
                $(this).remove();
                return; // skip this row
            }
        }

        // For all remaining rows (including single row), validate if empty
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

    // If all rows are empty (multiple rows), show single error
    if (!anyProductAdded && productRows.length > 1) {
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

  $("#modal-submit").click(function () {
    $("#bill-form").submit();
  });
});
