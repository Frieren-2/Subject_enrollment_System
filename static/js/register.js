document.addEventListener("DOMContentLoaded", function () {
  // Password match validation
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");
  const errorSpan = document.querySelector(".password-error");

  function validatePassword() {
    if (password.value !== confirmPassword.value) {
      errorSpan.textContent = "Passwords do not match";
      confirmPassword.setCustomValidity("Passwords do not match");
    } else {
      errorSpan.textContent = "";
      confirmPassword.setCustomValidity("");
    }
  }
  password.addEventListener("input", validatePassword);
  confirmPassword.addEventListener("input", validatePassword);

  // Register form submit
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = this.name.value.trim();
      const username = this.username.value.trim();
      const pwd = password.value;
      const confirm_pwd = confirmPassword.value;

      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          password: pwd,
          confirm_password: confirm_pwd,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Registration successful!");
            window.location.reload();
          } else {
            alert(data.message || "Registration failed.");
          }
        })
        .catch(() => alert("Registration failed."));
    });

  // Show modal with instructor list and actions (fetch from backend)
  document
    .getElementById("viewInstructorsBtn")
    .addEventListener("click", function () {
      fetch("/api/instructors")
        .then((res) => res.json())
        .then((data) => {
          const instructors = data.instructors || [];
          const tbody = document.querySelector("#instructorTable tbody");
          tbody.innerHTML = "";
          instructors.forEach((i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${i.name}</td>
              <td>${i.username}</td>
              <td>
                <span class="password-cell">${i.password}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning edit-btn" data-username="${i.username}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-username="${i.username}">Delete</button>
              </td>
            `;
            tbody.appendChild(row);
          });

          // Attach event listeners for edit/delete
          tbody.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
              const username = this.getAttribute("data-username");
              document.getElementById("edit-username").value = username;
              document.getElementById("edit-password").value = "";
              document.getElementById("edit-confirm-password").value = "";
              document.querySelector(".edit-password-error").textContent = "";
              var modal = new bootstrap.Modal(
                document.getElementById("editPasswordModal")
              );
              modal.show();
            });
          });
          tbody.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
              const username = this.getAttribute("data-username");
              if (confirm("Are you sure you want to delete this instructor?")) {
                fetch("/api/instructors/delete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username }),
                })
                  .then((res) => res.json())
                  .then((result) => {
                    if (result.success) {
                      // Refresh the table
                      document.getElementById("viewInstructorsBtn").click();
                    } else {
                      alert(result.message || "Delete failed.");
                    }
                  });
              }
            });
          });
        });

      // Show modal (Bootstrap 5)
      var modal = new bootstrap.Modal(
        document.getElementById("instructorModal")
      );
      modal.show();
    });

  // Close modal
  document
    .getElementById("closeModalBtn")
    .addEventListener("click", function () {
      var modalEl = document.getElementById("instructorModal");
      var modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    });

  // Edit password modal logic
  document
    .getElementById("editPasswordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("edit-username").value;
      const newPassword = document.getElementById("edit-password").value;
      const confirmPassword = document.getElementById(
        "edit-confirm-password"
      ).value;
      const errorSpan = document.querySelector(".edit-password-error");
      if (newPassword !== confirmPassword) {
        errorSpan.textContent = "Passwords do not match";
        return;
      }
      fetch("/api/instructors/update_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: newPassword }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            errorSpan.textContent = "";
            // Close modal
            var modalEl = document.getElementById("editPasswordModal");
            var modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            // Remove modal backdrop manually if still present
            setTimeout(() => {
              // Remove any lingering modal-backdrop
              document
                .querySelectorAll(".modal-backdrop")
                .forEach((el) => el.remove());
              // Remove 'modal-open' class from body if present
              document.body.classList.remove("modal-open");
              // Refresh instructor list if modal is open
              const instructorModal =
                document.getElementById("instructorModal");
              if (instructorModal.classList.contains("show")) {
                document.getElementById("viewInstructorsBtn").click();
              }
            }, 500);
          } else {
            errorSpan.textContent = result.message || "Update failed.";
          }
        });
    });

  // Close edit modal
  document
    .getElementById("closeEditModalBtn")
    .addEventListener("click", function () {
      var modalEl = document.getElementById("editPasswordModal");
      var modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    });
});
