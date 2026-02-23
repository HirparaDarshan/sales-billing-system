$(document).ready(function () {

    function initCustomerSelect() {
        $('.select2-customer').select2({
            width: '100%',
            placeholder: "Search Customer..."
        });
    }

    function initProductSelect(el) {
        el.select2({
            width: '100%',
            placeholder: "Select Product"
        });
    }

    initCustomerSelect();

    function addNewRow() {
        let template = $('#product-template').clone();
        template.removeAttr('id');
        template.removeClass('d-none');
        template.addClass('product-row');

        $('#product-container').append(template);

        initProductSelect(template.find('.select2-product'));
    }


    addNewRow();

    $('#add-product').click(function () {
        addNewRow();
    });

    // Remove row
    $(document).on('click', '.remove-product', function () {
        if ($('.product-row').length > 1) {
            $(this).closest('.product-row').remove();
            updateSummary();
        }
    });

    function updateRow(row) {
        let price = parseFloat(
            row.find('.product-select option:selected').data('price')
        ) || 0;

        let qty = parseInt(row.find('.qty-input').val()) || 0;

        row.find('.price-cell').text("₹" + price.toFixed(2));
        row.find('.subtotal-cell').text("₹" + (price * qty).toFixed(2));
    }

    function updateSummary() {
        let total = 0;
        let items = 0;

        $('.product-row').each(function () {
            let subtotal = parseFloat(
                $(this).find('.subtotal-cell').text().replace('₹','')
            ) || 0;

            if (subtotal > 0) items++;
            total += subtotal;
        });

        $('#total-items').text(items);
        $('#grand-total').text("₹" + total.toFixed(2));
    }

    $(document).on('change keyup', '.product-select, .qty-input', function () {
        let row = $(this).closest('.product-row');
        updateRow(row);
        updateSummary();
    });

    // REVIEW + VALIDATION
    $('#review-bill').click(function () {

        let hasError = false;
        $('.text-danger').text('');
        let modalBody = $('#modal-body');
        modalBody.empty();

        let customerSelect = $('.select2-customer');
        let customerVal = customerSelect.val();
        let customerName = customerSelect.find("option:selected").text();

        if (!customerVal) {
            $('.customer-error').text("Please select customer.");
            hasError = true;
        }

        let total = 0;
        let tableRows = "";

        $('.product-row').each(function (index) {

            let product = $(this).find('.product-select');
            let qtyInput = $(this).find('.qty-input');

            let productVal = product.val();
            let productName = product.find("option:selected").text();
            let qty = parseInt(qtyInput.val());
            let price = parseFloat(product.find('option:selected').data('price')) || 0;

            if (!productVal) {
                $(this).find('.product-error').text("Select product");
                hasError = true;
            }

            if (!qty || qty <= 0) {
                $(this).find('.qty-error').text("Invalid quantity");
                hasError = true;
            }

            if (productVal && qty > 0) {
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

        $('#modal-total').text("Grand Total: ₹" + total.toFixed(2));

        new bootstrap.Modal(
            document.getElementById('reviewModal')
        ).show();
    });

    $('#modal-submit').click(function () {
        $('#bill-form').submit();
    });

});
