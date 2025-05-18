// Global variables
let recommendedSubjects = [];
let currentUnits = 12;
const maxUnits = 18;
let allSubjects = []; // Will store all subjects for filtering
let currentStudent = null;
let enrolledSchedules = [];
let selectedStudent = null;
let currentLetter = "A";
let searchTimeout;

// Initialize on page load
window.onload = function () {
  // Store all subjects for filtering
  const table = document.getElementById("subjectsTable");
  const rows = table
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    allSubjects.push({
      code: cells[0].textContent,
      name: cells[1].textContent,
      units: parseInt(cells[2].textContent),
      prerequisites: cells[3].textContent,
      element: rows[i],
    });
  }

  // Initialize recommended subjects list
  updateRecommendedSubjectsList();
  initializeLetterFilter();
};

// Show demo student
function showDemoStudent() {
  document.getElementById("noStudentSelected").style.display = "none";
  document.getElementById("studentDetails").style.display = "block";
}

// Simulate search functionality for students
function searchStudent() {
  const searchValue = document.getElementById("studentSearch").value.trim();
  if (!searchValue) {
    alert("Please enter a Student USN or Name");
    return;
  }

  // Show loading state
  document.getElementById("studentInfo").classList.add("d-none");

  fetch("/instructor/get_student", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `student_search=${encodeURIComponent(searchValue)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      selectedStudent = data.student; // Store selected student

      // Show student info section
      const studentInfo = document.getElementById("studentInfo");
      studentInfo.classList.remove("d-none");

      // Update student details
      document.getElementById("studentUSN").textContent = data.student.usn;
      document.getElementById("studentName").textContent = data.student.name;

      // Update enrolled subjects
      updateEnrolledSubjects(data.student.usn);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while searching for the student");
    });
}

// Add event listener for Enter key
document
  .getElementById("studentSearch")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchStudent();
    }
  });

// Search subjects functionality
function searchSubjects() {
  const searchValue = document
    .getElementById("subjectSearch")
    .value.toLowerCase();
  const subjectTable = document.getElementById("availableSubjects");
  const rows = subjectTable.getElementsByTagName("tr");

  for (let row of rows) {
    const code = row.cells[0].textContent.toLowerCase();
    const name = row.cells[1].textContent.toLowerCase();
    const schedule = row.cells[2].textContent.toLowerCase();
    const room = row.cells[3].textContent.toLowerCase();

    if (
      code.includes(searchValue) ||
      name.includes(searchValue) ||
      schedule.includes(searchValue) ||
      room.includes(searchValue)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  }
}

// Add event listener for real-time search
document
  .getElementById("subjectSearch")
  .addEventListener("keyup", searchSubjects);

// Filter subjects by search text
function filterSubjectsByText(searchText) {
  // Loop through all subjects and hide/show based on search
  allSubjects.forEach((subject) => {
    const matchesSearch =
      subject.code.toLowerCase().includes(searchText) ||
      subject.name.toLowerCase().includes(searchText);

    subject.element.style.display = matchesSearch ? "" : "none";
  });
}

// Filter subjects by program and year
function filterSubjects() {
  const programFilter = document.getElementById("programFilter").value;
  const yearFilter = document.getElementById("yearFilter").value;
  const searchText = document
    .getElementById("subjectSearch")
    .value.trim()
    .toLowerCase();

  // Loop through all subjects
  allSubjects.forEach((subject) => {
    let showSubject = true;

    // Filter by program if not "all"
    if (programFilter !== "all") {
      if (!subject.code.startsWith(programFilter)) {
        showSubject = false;
      }
    }

    // Filter by search text if present
    if (searchText !== "") {
      if (
        !subject.code.toLowerCase().includes(searchText) &&
        !subject.name.toLowerCase().includes(searchText)
      ) {
        showSubject = false;
      }
    }

    // Apply the filter
    subject.element.style.display = showSubject ? "" : "none";
  });
}

// Reset subject filter
function resetSubjectFilter() {
  document.getElementById("programFilter").value = "all";
  document.getElementById("yearFilter").value = "all";
  document.getElementById("subjectSearch").value = "";

  // Show all subjects
  allSubjects.forEach((subject) => {
    subject.element.style.display = "";
  });
}

// Recommend a subject to the student
function recommendSubject(code, name, units) {
  // Check if subject is already recommended
  if (recommendedSubjects.some((subject) => subject.code === code)) {
    alert(`${code} is already in your recommendations!`);
    return;
  }

  // Check if adding this subject would exceed max units
  if (currentUnits + units > maxUnits) {
    alert(
      `Adding this subject would exceed the maximum allowed units (${maxUnits})`
    );
    return;
  }

  // Add to recommended subjects
  recommendedSubjects.push({ code, name, units });

  // Update recommended subjects list
  updateRecommendedSubjectsList();

  // Update total units
  currentUnits += units;
  document.getElementById("currentTotalUnits").textContent = currentUnits;
}

// Update the recommended subjects list
function updateRecommendedSubjectsList() {
  const container = document.getElementById("recommendedSubjectsList");
  container.innerHTML = "";

  if (recommendedSubjects.length === 0) {
    container.innerHTML =
      "<p>No subjects recommended yet. Select subjects from the list.</p>";
    return;
  }

  recommendedSubjects.forEach((subject) => {
    const subjectCard = document.createElement("div");
    subjectCard.className = "subject-card";
    subjectCard.innerHTML = `
            <h4>${subject.code}</h4>
            <p>${subject.name}</p>
            <p class="units">${subject.units} Units</p>
            <button class="btn btn-secondary" onclick="removeRecommendation('${subject.code}')">Remove</button>
        `;
    container.appendChild(subjectCard);
  });
}

// Remove a recommendation
function removeRecommendation(code) {
  const subjectIndex = recommendedSubjects.findIndex(
    (subject) => subject.code === code
  );
  if (subjectIndex === -1) return;

  // Subtract units
  currentUnits -= recommendedSubjects[subjectIndex].units;
  document.getElementById("currentTotalUnits").textContent = currentUnits;

  // Remove from array
  recommendedSubjects.splice(subjectIndex, 1);

  // Update list
  updateRecommendedSubjectsList();
}

// Clear all recommendations
function clearRecommendations() {
  recommendedSubjects = [];
  currentUnits = 12; // Reset to initial units
  document.getElementById("currentTotalUnits").textContent = currentUnits;
  updateRecommendedSubjectsList();
}

// Send recommendations to student
function sendRecommendations() {
  if (recommendedSubjects.length === 0) {
    alert("Please select at least one subject to recommend");
    return;
  }

  // In a real app, this would send the recommendations to the backend
  alert(
    `Recommendations sent to student: ${recommendedSubjects
      .map((s) => s.code)
      .join(", ")}`
  );

  // Clear recommendations after sending
  clearRecommendations();
}

function displayStudentInfo(data) {
  currentStudent = data.student;
  enrolledSchedules = data.enrolled_subjects;

  document.getElementById("studentInfo").classList.remove("d-none");
  document.getElementById("studentDetails").innerHTML = `
      <p><strong>Name:</strong> ${data.student.name}</p>
      <p><strong>Course:</strong> ${data.student.course}</p>
      <p><strong>Year:</strong> ${data.student.year}</p>
  `;

  const enrolledSubjectsHtml = data.enrolled_subjects
    .map(
      (subject) => `
      <tr>
          <td>${subject.subject}</td>
          <td>${subject.day_of_week} ${subject.start_time}-${subject.end_time}</td>
          <td>${subject.room}</td>
          <td>${subject.units}</td>
      </tr>
  `
    )
    .join("");

  document.getElementById("enrolledSubjects").innerHTML = enrolledSubjectsHtml;
  checkTimeConflicts();
}

function checkTimeConflicts() {
  if (!currentStudent || !document.getElementById("conflictCheck").checked) {
    return;
  }

  const availableSubjects = document.querySelectorAll("#availableSubjects tr");
  availableSubjects.forEach((row) => {
    const schedule = row.dataset.schedule.split(",");
    const hasConflict = checkScheduleConflict(
      schedule[0],
      schedule[1],
      schedule[2]
    );

    const statusCell = row.querySelector(`td[id^="status-"]`);
    const recommendBtn = row.querySelector("button");

    if (hasConflict) {
      statusCell.innerHTML = '<span class="badge bg-danger">Conflict</span>';
      recommendBtn.disabled = true;
    } else {
      statusCell.innerHTML = '<span class="badge bg-success">Available</span>';
      recommendBtn.disabled = false;
    }
  });
}

function checkScheduleConflict(day, startTime, endTime) {
  return enrolledSchedules.some((enrolled) => {
    if (enrolled.day_of_week !== day) return false;

    const newStart = new Date(`2000-01-01 ${startTime}`);
    const newEnd = new Date(`2000-01-01 ${endTime}`);
    const enrolledStart = new Date(`2000-01-01 ${enrolled.start_time}`);
    const enrolledEnd = new Date(`2000-01-01 ${enrolled.end_time}`);

    return newStart < enrolledEnd && newEnd > enrolledStart;
  });
}

function recommendSubject(subjectCode, subjectName) {
  if (!currentStudent) {
    alert("Please select a student first");
    return;
  }

  fetch("/instructor/add_recommendation", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `student_id=${currentStudent.student_id}&subject_code=${subjectCode}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        alert(
          `Successfully recommended ${subjectName} to ${currentStudent.name}`
        );
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("conflictCheck")
    .addEventListener("change", checkTimeConflicts);
});

function toggleDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show");
}

// Close dropdown when clicking outside
window.onclick = function (event) {
  if (
    !event.target.matches(".profile-trigger") &&
    !event.target.matches(".user-avatar")
  ) {
    const dropdowns = document.getElementsByClassName("dropdown-menu");
    for (const dropdown of dropdowns) {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    }
  }
};

function viewSubjectDetails(subjectId) {
  if (!selectedStudent) return;

  // Show recommendation section
  document.getElementById("recommendationSection").classList.remove("d-none");

  // Get available subjects that don't conflict
  fetch("/instructor/get_available_subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `student_id=${selectedStudent.usn}&subject_id=${subjectId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      const recommendedSubjectsHtml = data.subjects
        .map(
          (subject) => `
          <tr>
              <td>${subject.subject_name}</td>
              <td>${subject.day_of_week} ${subject.start_time}-${subject.end_time}</td>
              <td>${subject.room}</td>
              <td>
                  <button class="btn btn-primary btn-sm" 
                          onclick="recommendSubject('${subject.subj_avail_id}', '${selectedStudent.usn}')">
                      Recommend
                  </button>
              </td>
          </tr>
      `
        )
        .join("");

      document.getElementById("recommendedSubjects").innerHTML =
        recommendedSubjectsHtml;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error loading available subjects");
    });
}

function recommendSubject(subjectId, studentId) {
  fetch("/instructor/recommend_subject", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `subject_id=${subjectId}&student_id=${studentId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      alert("Subject recommended successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error recommending subject");
    });
}

function toggleEnrollmentSection(card) {
  card.classList.toggle("expanded");
  const enrollmentSection = card.querySelector(".enrollment-section");
  enrollmentSection.classList.toggle("d-none");
}

function showEnlistmentModal() {
  if (!selectedStudent) return;

  // Update the available subjects table to show only subjects that can be enlisted
  const availableSubjects = document.getElementById("availableSubjects");
  const rows = availableSubjects.getElementsByTagName("tr");

  for (let row of rows) {
    const recommendButton = row.querySelector("button");
    recommendButton.textContent = "Enlist";
    recommendButton.onclick = () =>
      enlistSubject(row.dataset.subjectId, selectedStudent.usn);
  }
}

function enlistSubject(subjectId, studentUsn) {
  fetch("/instructor/enlist_subject", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `subject_id=${subjectId}&student_id=${studentUsn}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Subject enlisted successfully!");
        // Refresh the enrolled subjects list
        updateEnrolledSubjects(studentUsn);
      } else {
        alert(data.message || "Error enlisting subject");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error enlisting subject");
    });
}

function updateEnrolledSubjects(subjects) {
  const tbody = document.getElementById("enrolledSubjects");
  const totalUnitsCell = document.getElementById("totalUnits");
  tbody.innerHTML = ""; // Clear existing entries
  let totalUnits = 0;

  subjects.forEach((subject) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${subject.Sub_code || "-"}</td>
            <td>${subject.subject}</td>
            <td>${subject.day_of_week} ${subject.start_time}-${
      subject.end_time
    }</td>
            <td>${subject.room}</td>
            <td class="text-center">${subject.units || "-"}</td>
            <td class="text-center">
                <button class="btn btn-danger btn-sm" onclick="unenrollSubject('${
                  subject.sub_avail_id
                }')">
                    <i class="fas fa-times"></i> Drop
                </button>
            </td>
        `;
    tbody.appendChild(row);
    totalUnits += parseInt(subject.units || 0);
  });

  totalUnitsCell.textContent = totalUnits;

  // Show enrolled subjects section
  document.querySelector(".enrollment-section").classList.remove("d-none");
}

function searchStudent() {
  const searchInput = document.getElementById("studentSearch").value;

  fetch("/instructor/get_student", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `student_search=${encodeURIComponent(searchInput)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("studentUSN").textContent = data.student.usn;
        document.getElementById("studentName").textContent = data.student.name;
        document.getElementById("studentInfo").classList.remove("d-none");
        updateEnrolledSubjects(data.enrolled_subjects);
      } else {
        alert("Student not found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error searching for student");
    });
}

// Letter filter and real-time search functionality
document.addEventListener("DOMContentLoaded", function () {
  setupSearchHandler();
  loadStudents(currentLetter);
});

function initializeLetterFilter() {
  const filterContainer = document.getElementById("letterFilter");
  const letters = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = `letter-btn ${letter === "A" ? "active" : ""}`;
    btn.textContent = letter;
    btn.onclick = () => filterByLetter(letter);
    filterContainer.appendChild(btn);
  });
}

function setupSearchHandler() {
  const searchInput = document.getElementById("studentSearch");
  searchInput.addEventListener("input", function (e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadStudents(currentLetter, e.target.value);
    }, 300);
  });
}

function filterByLetter(letter) {
  currentLetter = letter;
  document.querySelectorAll(".letter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === letter);
  });
  loadStudents(letter, document.getElementById("studentSearch").value);
}

function loadStudents(letter, search = "") {
  const studentList = document.getElementById("studentList");
  studentList.innerHTML =
    '<div class="text-center"><div class="spinner-border" role="status"></div></div>';

  fetch("/instructor/filter_students", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `letter=${encodeURIComponent(letter)}&search=${encodeURIComponent(
      search
    )}`,
  })
    .then((response) => response.json())
    .then((data) => {
      studentList.innerHTML = "";
      if (data.students && data.students.length > 0) {
        data.students.forEach((student) => {
          studentList.appendChild(createStudentCard(student));
        });
      } else {
        studentList.innerHTML =
          '<div class="text-center text-muted p-3">No students found</div>';
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      studentList.innerHTML =
        '<div class="text-center text-danger p-3">Error loading students</div>';
    });
}

function createStudentCard(student) {
  const card = document.createElement("div");
  card.className = "student-card";

  card.innerHTML = `
        <div class="student-header" onclick="toggleCard(this)">
            <div>
                <strong>${student.name}</strong>
                <small class="text-muted ms-2">${student.USN}</small>
            </div>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="student-content">
            <div class="mb-3">
                <div><strong>Course:</strong> ${student.course}</div>
                <div><strong>Year:</strong> ${student.year}</div>
            </div>
            <div class="mb-3">
                <h6>Enrolled Subjects:</h6>
                <ul class="subject-list">
                    ${
                      student.subjects
                        ? student.subjects
                            .split(",")
                            .map(
                              (subject) =>
                                `<li class="subject-item">${subject.trim()}</li>`
                            )
                            .join("")
                        : '<li class="subject-item text-muted">No subjects enrolled</li>'
                    }
                </ul>
            </div>
            <button class="btn btn-primary btn-sm" onclick="showEnlistmentModal('${
              student.USN
            }')">
                <i class="fas fa-plus"></i> Enlist Subject
            </button>
        </div>
    `;

  if (document.getElementById("autoExpand").checked) {
    card.querySelector(".student-content").classList.add("show");
    card.querySelector(".student-header i").style.transform = "rotate(180deg)";
  }

  return card;
}

function toggleCard(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector("i");

  content.classList.toggle("show");
  icon.style.transform = content.classList.contains("show")
    ? "rotate(180deg)"
    : "";
}
function searchStudent() {
  const searchValue = document.getElementById("studentSearch").value.trim();

  if (!searchValue) {
    alert("Please enter a student name.");
    return;
  }

  fetch("/instructor/get_student", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ student_search: searchValue }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Show student info
      document.getElementById("studentInfo").classList.remove("d-none");
      document.getElementById("studentUSN").innerText = data.student.usn;
      document.getElementById("studentName").innerText = data.student.name;
      document.getElementById("studentProgram").innerText =
        data.student.program || "—";

      // Populate enrolled subjects
      const tbody = document.getElementById("enrolledSubjects");
      tbody.innerHTML = "";

      let totalUnits = 0;
      data.enrolled_subjects.forEach((sub) => {
        const row = document.createElement("tr");
        row.innerHTML = `
              <td>${sub.subject}</td>
              <td>${sub.subject}</td>
              <td>${sub.day_of_week} ${sub.start_time} - ${sub.end_time}</td>
              <td>${sub.room}</td>
              <td>3</td>
              <td>
                  <button class="btn btn-danger btn-sm">Drop</button>
              </td>
          `;
        tbody.appendChild(row);
        totalUnits += 3; // You can adjust this if you have real unit data
      });

      document.getElementById("totalUnits").innerText = totalUnits;
    })
    .catch((error) => {
      console.error("Error fetching student:", error);
      alert("An error occurred while fetching student data.");
    });
}

function handleSearchInput(value) {
  if (value.length >= 3) {
    fetch(`/search_student?query=${value}`)
      .then((response) => response.json())
      .then((data) => {
        displaySearchResults(data);
      });
  } else {
    document.getElementById("searchResults").classList.add("d-none");
  }
}

function selectStudent(studentId) {
  fetch(`/get_student_details/${studentId}`)
    .then((response) => response.json())
    .then((data) => {
      displayStudentInfo(data.student);
      fetchEnrolledSubjects(studentId);
    });
}

function fetchEnrolledSubjects(studentId) {
  fetch(`/get_enrolled_subjects/${studentId}`)
    .then((response) => response.json())
    .then((data) => {
      displayEnrolledSubjects(data.subjects);
      calculateTotalUnits(data.subjects);
    });
}

function displayEnrolledSubjects(subjects) {
  const tbody = document.getElementById("enrolledSubjects");
  tbody.innerHTML = "";

  subjects.forEach((subject) => {
    const row = `
            <tr>
                <td>${subject.Sub_code}</td>
                <td>${subject.subject_name}</td>
                <td>${subject.day_of_week} ${subject.start_time}-${subject.end_time}</td>
                <td>${subject.room}</td>
                <td>${subject.units}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="dropSubject('${subject.enrollment_id}')">
                        <i class="fas fa-trash"></i> Drop
                    </button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });
}

function calculateTotalUnits(subjects) {
  const totalUnits = subjects.reduce(
    (sum, subject) => sum + parseInt(subject.units),
    0
  );
  document.getElementById("totalUnits").textContent = totalUnits;
}

function dropSubject(enrollmentId) {
  if (confirm("Are you sure you want to drop this subject?")) {
    fetch(`/drop_subject/${enrollmentId}`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Refresh the enrolled subjects list
          fetchEnrolledSubjects(data.student_id);
        } else {
          alert("Failed to drop subject");
        }
      });
  }
}
