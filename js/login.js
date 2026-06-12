document.getElementById("loginForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = Auth.login(email, password);

    if (result.success) {

        window.location.href = "dashboard.html";

    } else {
        alert(result.message);
    }
});
