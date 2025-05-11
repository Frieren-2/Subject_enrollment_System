document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap modals
  var modals = document.querySelectorAll(".modal");
  modals.forEach(function (modal) {
    new bootstrap.Modal(modal);
  });

  // Reset modal form when closed
  modals.forEach(function (modal) {
    modal.addEventListener("hidden.bs.modal", function () {
      var form = modal.querySelector("form");
      if (form) {
        form.reset();
      }
    });
  });

  // Client-side search functionality
  const searchInput = document.getElementById("subjectSearch");
  const subjectRows = document.querySelectorAll(".subject-row");
  const noResultsRow = document.createElement("tr");
  noResultsRow.id = "no-results-row";
  noResultsRow.innerHTML = `
      <td colspan="7" class="text-center text-muted py-4">
          <i class="bx bx-info-circle me-2"></i>No subjects found matching your search.
      </td>
  `;
  const subjectCountBadge = document.getElementById("subjectCount");
  const subjectTableBody = document.getElementById("subjectTableBody");

  // Initial count
  const totalSubjects = subjectRows.length;

  // Handle search filtering
  function filterSubjects() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    let hasVisibleRows = false;

    // Remove existing no-results row if present
    const existingNoResults = document.getElementById("no-results-row");
    if (existingNoResults) {
      existingNoResults.remove();
    }

    subjectRows.forEach((row) => {
      const subjectName = row
        .querySelector(".subject-name")
        .textContent.toLowerCase();
      if (searchTerm === "" || subjectName.includes(searchTerm)) {
        row.style.display = "";
        visibleCount++;
        hasVisibleRows = true;
      } else {
        row.style.display = "none";
      }
    });

    // Update count badge
    subjectCountBadge.textContent = `${visibleCount} of ${totalSubjects} Subjects`;

    // Show no results message if needed
    if (!hasVisibleRows) {
      subjectTableBody.appendChild(noResultsRow);
    }
  }

  // Add event listener with a small delay for better performance
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterSubjects, 200); // 200ms delay for smoother experience
    });

    // Apply any initial search from URL
    if (searchInput.value) {
      filterSubjects();
    }
  }
});
