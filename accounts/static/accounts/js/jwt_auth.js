$(document).ready(function () {

    function getAccessToken() { return localStorage.getItem("access_token"); }
    function getRefreshToken() { return localStorage.getItem("refresh_token"); }

    $.ajaxSetup({
        beforeSend: function (xhr) {
            var token = getAccessToken();
            if (token) xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        statusCode: {
            401: function () {
                refreshAccessToken()
                    .then(function () { location.reload(); })
                    .catch(function () { window.location.href = "/login/"; });
            }
        }
    });

    function refreshAccessToken() {
        var refresh = getRefreshToken();
        if (!refresh) return Promise.reject("No refresh token");
        return $.ajax({
            url: "/api/token/refresh/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ refresh: refresh }),
            success: function (res) { localStorage.setItem("access_token", res.access); }
        });
    }

    // Allow normal Django session login; also fetch JWT in background for API use
    $("#loginForm").submit(function () {
        var username = $(this).find("input[name=username]").val();
        var password = $(this).find("input[name=password]").val();
        $.ajax({
            url: "/api/token/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: username, password: password }),
            success: function (res) {
                localStorage.setItem("access_token", res.access);
                localStorage.setItem("refresh_token", res.refresh);
            }
        });
        // Form submits normally — Django creates session
    });

    // Clear JWT tokens on logout
    $("#logoutForm").submit(function () {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    });

});
