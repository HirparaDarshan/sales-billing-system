$(document).ready(function () {
  $("#customerForm").validate({
    rules: {
      name: { required: true, minlength: 3 },
      email: { required: true, email: true },
      mobile: { required: true, digits: true, minlength: 10, maxlength: 10 },
      customer_type: { required: true },
    },
    messages: {
      name: {
        required: "Please enter customer name",
        minlength: "Name must be at least 3 characters",
      },
      email: { required: "Please enter email", email: "Enter a valid email" },
      mobile: {
        required: "Enter mobile",
        digits: "Only digits",
        minlength: "10 digits",
        maxlength: "10 digits",
      },
      customer_type: { required: "Please select type" },
    },
    errorClass: "text-danger",
    errorElement: "small",

    submitHandler: function (form) {
      $.ajax({
        url: "/api/customers/",
        type: "POST",
        data: {
          name: $("#id_name").val(),
          email: $("#id_email").val(),
          mobile: $("#id_mobile").val(),
          customer_type: $("#id_customer_type").val(),
        },
        headers: { "X-CSRFToken": $("input[name=csrfmiddlewaretoken]").val() },
        success: function (data) {
          alert("Customer Created Successfully! ID: " + data.id);
          $("#customerForm")[0].reset();

          if (typeof loadCustomers === "function") {
            loadCustomers($(".select2-customer"));
          }
        },
        error: function (xhr) {
          let err = xhr.responseJSON;
          if (err) {
            let msgs = [];
            for (let key in err) msgs.push(key + ": " + err[key]);
            alert("Error:\n" + msgs.join("\n"));
          } else {
            alert("Something went wrong!");
          }
        },
      });

      return false;
    },
  });
});
