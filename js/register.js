document.getElementById("registerForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    const result = Auth.register(name, email, password);

    if (result.success) {

        alert("Registration successful");
        window.location.href = "index.html";

    } else {
        alert(result.message);
    }
});
