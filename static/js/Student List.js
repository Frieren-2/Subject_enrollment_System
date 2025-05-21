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
// Search functionality for cards
document.getElementById('searchInput').addEventListener('keyup', function () {
  let input = this.value.toLowerCase();
  let cards = document.querySelectorAll('.student-card-list .student-card');
  cards.forEach(card => {
      let name = card.getAttribute('data-name').toLowerCase();
      let usn = card.getAttribute('data-usn').toLowerCase();
      let program = card.getAttribute('data-program').toLowerCase();
      card.style.display = (name.includes(input) || usn.includes(input) || program.includes(input)) ? '' : 'none';
  });
});

// Show modal and populate with data
async function showStudentModal(card) {
  const studentId = card.getAttribute('data-student-id');
  const name = card.getAttribute('data-name');
  const usn = card.getAttribute('data-usn');
  const program = card.getAttribute('data-program');
  const year = card.getAttribute('data-year');
  const units = card.getAttribute('data-units');

  document.getElementById('modalName').textContent = name;
  document.getElementById('modalUsn').textContent = usn;
  document.getElementById('modalUnits').textContent = units;
  document.getElementById('modalProgram').textContent = program;
  document.getElementById('modalYear').textContent = year;

  try {
      const response = await fetch(`/get_enrolled_subjects/${studentId}`);
      const data = await response.json();
      
      // Populate subjects table
      const tableBody = document.getElementById('subjectsTableBody');
      tableBody.innerHTML = '';
      let totalUnits = 0;
      data.subjects.forEach(subject => {
          const row = `
              <tr>
                  <td>${subject.Sub_code}</td>
                  <td>${subject.subject_name}</td>
                  <td>${subject.units}</td>
                  <td>${subject.day_of_week} ${subject.start_time}-${subject.end_time}</td>
                  <td>${subject.room}</td>
              </tr>
          `;
          tableBody.innerHTML += row;
          totalUnits += parseFloat(subject.units) || 0;
      });
      document.getElementById('totalUnits').textContent = totalUnits;

      // Show conflicts if any
      const conflictsDiv = document.getElementById('scheduleConflicts');
      const conflictsList = document.getElementById('conflictsList');
      
      if (data.conflicts && data.conflicts.length > 0) {
          conflictsList.innerHTML = data.conflicts.map(conflict => `
              <div class="conflict-item mb-2">
                  <small>
                      ${conflict.subject1.code} (${conflict.subject1.schedule}) 
                      conflicts with 
                      ${conflict.subject2.code} (${conflict.subject2.schedule})
                  </small>
              </div>
          `).join('');
          conflictsDiv.style.display = 'block';
      } else {
          conflictsDiv.style.display = 'none';
      }
  } catch (error) {
      console.error('Error fetching subjects:', error);
  }

  document.getElementById('studentModal').style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('studentModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('studentModal');
  if (event.target === modal) {
      modal.style.display = 'none';
  }
}
