// student_list.js
document.addEventListener("DOMContentLoaded", function () {
  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const searchValue = this.value.toLowerCase();
      const tableRows = document.querySelectorAll("tbody tr");

      tableRows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchValue) ? "" : "none";
      });
    });
  }

  // Edit button functionality
  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const studentId = row.querySelector("td:first-child").textContent;
      alert("Edit student with ID: " + studentId);
      // Here you would typically open a modal or redirect to an edit page
    });
  });

  // Delete button functionality
  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const studentId = row.querySelector("td:first-child").textContent;
      const studentName = row.querySelector("td:nth-child(2)").textContent;

      if (
        confirm(`Are you sure you want to delete student "${studentName}"?`)
      ) {
        // Here you would typically send a delete request to the server
        row.remove();
        alert("Student deleted successfully");
      }
    });
  });
});
