    document.addEventListener("DOMContentLoaded", function () {
    // Password visibility toggle
    const toggleBtns = document.querySelectorAll(".password-toggle");
    toggleBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
        const input = this.parentElement.querySelector("input");
        const icon = this.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
        });
    });

    // Password validation
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const errorSpans = document.querySelectorAll(".password-error");

    function validatePassword() {
        if (password.value !== confirmPassword.value) {
        errorSpans[1].textContent = "Passwords do not match";
        confirmPassword.setCustomValidity("Passwords do not match");
        } else {
        errorSpans[1].textContent = "";
        confirmPassword.setCustomValidity("");
        }
    }

    password.addEventListener("change", validatePassword);
    confirmPassword.addEventListener("keyup", validatePassword);

    // Form submission
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (password.value === confirmPassword.value) {
        this.classList.add("loading");
        // Add your form submission logic here
        }
    });
    });
