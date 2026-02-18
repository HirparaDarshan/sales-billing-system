$(document).ready(function(){
    // Add new product row
    $('#add-product').click(function(){
        let newRow = $('.product-row:first').clone();
        newRow.find('select, input').val('');
        $('#product-container').append(newRow);
    });

    // Remove product row
    $(document).on('click', '.remove-product', function(){
        if($('.product-row').length > 1){
            $(this).closest('.product-row').remove();
        } else {
            alert("At least one product required");
        }
    });

    // Review Modal
    $('#review-bill').click(function(){
        let modalBody = $('#modal-body');
        modalBody.empty();
        let total = 0;

        $('.product-row').each(function(index){
            let product = $(this).find('select option:selected').text();
            let qty = parseInt($(this).find('input[name="quantity"]').val());
            let priceText = $(this).find('select option:selected').text();
            let price = parseFloat(priceText.match(/₹(\d+(\.\d+)?)/)[1]);
            let subtotal = price * qty;
            total += subtotal;
            modalBody.append(`<p>${index+1}. ${product} | Qty: ${qty} | Price: ₹${price} | Subtotal: ₹${subtotal}</p>`);
        });

        $('#modal-total').text('Total: ₹' + total);
        $('#reviewModal').modal('show');
    });

    // Typeahead for Customer and Product
    $('.typeahead').each(function(){
        let select = $(this);
        let options = [];
        select.find('option').each(function(){
            if($(this).val() !== "") options.push($(this).text());
        });

        select.parent().find('input').autocomplete({
            source: options,
            minLength: 1
        });
    });

    $('#modal-submit').click(function(){
    $('#bill-form').submit();
    });
});



