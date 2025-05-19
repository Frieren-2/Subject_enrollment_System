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
let selectedStudentId = null;

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
  if (!enrolledSchedules || !Array.isArray(enrolledSchedules)) {
    console.log("No enrolled schedules to check against");
    return;
  }

  const availableSubjects = document.querySelectorAll("#availableSubjects tr");
  availableSubjects.forEach((row) => {
    // Get schedule data from the row
    const dayOfWeek = row.cells[2].textContent.split(" ")[0]; // Get day from schedule column
    const [startTime, endTime] = row.cells[2].textContent
      .split(" ")[1]
      .split("-");

    const hasConflict = enrolledSchedules.some((enrolled) => {
      // Split enrolled days if multiple
      const enrolledDays = enrolled.day_of_week.split(",").map((d) => d.trim());

      // Check if days overlap
      if (!enrolledDays.includes(dayOfWeek)) return false;

      // Convert times to minutes for comparison
      const newStart = timeToMinutes(startTime);
      const newEnd = timeToMinutes(endTime);
      const enrolledStart = timeToMinutes(enrolled.start_time);
      const enrolledEnd = timeToMinutes(enrolled.end_time);

      return newStart < enrolledEnd && newEnd > enrolledStart;
    });

    // Update row status and button
    const enlistButton = row.querySelector("button");
    const statusCell = row.querySelector("td:last-child") || row.insertCell();

    if (hasConflict) {
      statusCell.innerHTML = '<span class="badge bg-danger">Conflict</span>';
      enlistButton.disabled = true;
    } else {
      statusCell.innerHTML = '<span class="badge bg-success">Available</span>';
      enlistButton.disabled = false;
    }
  });
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

// Add event listener for conflict checking
document.addEventListener("DOMContentLoaded", () => {
  const conflictCheck = document.getElementById("conflictCheck");
  if (conflictCheck) {
    conflictCheck.addEventListener("change", checkTimeConflicts);
  }
});

// Recommend a subject to the student
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

  checkTimeConflicts(); // Check conflicts when showing available subjects
}

function enlistSubject(subjAvailId, subjectName) {
  if (!selectedStudentId) {
    alert("Please select a student first");
    return;
  }

  console.log(
    `Enlisting - Student: ${selectedStudentId}, Subject: ${subjAvailId}`
  ); // Debug log

  if (!subjAvailId) {
    alert("Subject ID is missing");
    return;
  }

  const formData = new FormData();
  formData.append("student_id", selectedStudentId);
  formData.append("subj_avail_id", subjAvailId);

  fetch("/instructor/enlist_subject", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(`Successfully enlisted in ${subjectName}`);
        fetchStudentDetails(selectedStudentId); // Refresh the enrolled subjects list
      } else {
        alert(data.message || "Failed to enlist subject");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error enlisting subject");
    });
}

// Unified dropSubject function
function dropSubject(id) {
  if (!selectedStudentId) {
    alert("Please select a student first");
    return;
  }

  if (!confirm("Are you sure you want to drop this subject?")) {
    return;
  }

  fetch(`/drop_subject/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Subject dropped successfully");
        // Fetch updated student data using the stored selectedStudentId
        fetch("/instructor/get_student", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `student_search=${selectedStudentId}`,
        })
          .then((response) => response.json())
          .then((studentData) => {
            if (studentData.success) {
              // Update the enrolled subjects list with new data
              updateEnrolledSubjects(studentData.enrolled_subjects || []);
            }
          })
          .catch((error) => {
            console.error("Error refreshing student data:", error);
          });
      } else {
        throw new Error(data.message || "Failed to drop subject");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
}

function updateEnrolledSubjects(subjects) {
  const tbody = document.getElementById("enrolledSubjects");
  const totalUnitsElement = document.getElementById("totalUnits");
  tbody.innerHTML = "";
  let totalUnits = 0;

  // Ensure selectedStudentId is set
  selectedStudentId = subjects[0]?.student_id || selectedStudentId;

  subjects.forEach((subject) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${subject.Sub_code}</td>
          <td>${subject.subject}</td>
          <td>${subject.day_of_week}-${subject.end_time}</td>
          <td>${subject.units}</td>
          <td>
              <button class="btn btn-danger btn-sm" onclick="dropSubject('${
                subject.subj_avail_id || subject.enrollment_id
              }', selectedStudentId)">
                  <i class="fas fa-times"></i> Drop
              </button>
          </td>
      `;
    tbody.appendChild(row);
    totalUnits += parseInt(subject.units || 0);
  });

  totalUnitsElement.textContent = totalUnits;
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

      selectedStudent = data.student;
      enrolledSchedules = data.enrolled_subjects; // Store enrolled subjects globally

      // Update UI
      const studentInfo = document.getElementById("studentInfo");
      studentInfo.classList.remove("d-none");
      document.getElementById("studentUSN").textContent = data.student.usn;
      document.getElementById("studentName").textContent = data.student.name;

      // Update enrolled subjects and check conflicts
      updateEnrolledSubjects(data.enrolled_subjects);
      checkTimeConflicts(); // Check for conflicts after loading student data
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

function selectStudent(usn, name) {
  selectedStudentId = usn; // Make sure this is set correctly

  // Update UI
  document.getElementById("studentSearch").value = name;
  document.getElementById("selectedStudent").classList.remove("d-none");
  document.getElementById("studentName").textContent = name;
  document.getElementById("studentDetails").textContent = `USN: ${usn}`;

  // Hide search results and fetch details
  hideSearchResults();
  fetchStudentDetails(usn);
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
                    <button class="btn btn-danger btn-sm" onclick="dropSubject('${subject.enrollment_id}', selectedStudentId)">
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

function dropSubject(id) {
  if (!selectedStudentId) {
    alert("Please select a student first");
    return;
  }

  if (!confirm("Are you sure you want to drop this subject?")) {
    return;
  }

  fetch(`/drop_subject/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Subject dropped successfully");
        // Fetch updated student data using the stored selectedStudentId
        fetch("/instructor/get_student", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `student_search=${selectedStudentId}`,
        })
          .then((response) => response.json())
          .then((studentData) => {
            if (studentData.success) {
              // Update the enrolled subjects list with new data
              updateEnrolledSubjects(studentData.enrolled_subjects || []);
            }
          })
          .catch((error) => {
            console.error("Error refreshing student data:", error);
          });
      } else {
        throw new Error(data.message || "Failed to drop subject");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
}

function filterStudents(searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    hideSearchResults();
    return;
  }

  const formData = new FormData();
  formData.append("search", searchTerm);

  fetch("/instructor/search_students", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const searchResults = document.getElementById("searchResults");
      searchResults.innerHTML = "";
      searchResults.classList.remove("d-none");

      if (data.success && data.students && data.students.length > 0) {
        data.students.forEach((student) => {
          const resultItem = document.createElement("div");
          resultItem.className = "search-item";
          resultItem.innerHTML = `
                    <div class="student-info-header d-flex justify-content-between align-items-center p-2">
                        <div>
                            <div class="fw-bold">${student.name}</div>
                            <small class="text-muted">USN: ${student.USN}</small>
                        </div>
                        <i class="fas fa-chevron-right expand-icon"></i>
                    </div>
                    <div class="expanded-content d-none p-3 border-top">
                        <div class="mb-3">
                            <h6>Student Details</h6>
                            <p class="mb-1">Name: ${student.name}</p>
                            <p class="mb-1">USN: ${student.USN}</p>
                        </div>
                        <button class="btn btn-primary btn-sm w-100" onclick="selectAndEnlist('${student.USN}', '${student.name}')">
                            <i class="fas fa-plus-circle me-1"></i> Enlist Subjects
                        </button>
                    </div>
                `;

          // Add click handler for expansion
          const header = resultItem.querySelector(".student-info-header");
          const content = resultItem.querySelector(".expanded-content");
          const icon = resultItem.querySelector(".expand-icon");

          header.addEventListener("click", (e) => {
            // Prevent triggering select when clicking expand
            e.stopPropagation();

            // Toggle expanded content
            content.classList.toggle("d-none");
            icon.style.transform = content.classList.contains("d-none")
              ? "rotate(0deg)"
              : "rotate(90deg)";
          });

          searchResults.appendChild(resultItem);
        });
      } else {
        searchResults.innerHTML = `
                <div class="search-item text-muted">No students found</div>
            `;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showToast("Error searching for students", "danger");
    });
}

function selectAndEnlist(usn, name) {
  selectedStudentId = usn; // Store the USN globally

  // Update UI
  document.getElementById("studentSearch").value = name;
  document.getElementById("selectedStudent").classList.remove("d-none");
  document.getElementById("studentName").textContent = name;
  document.getElementById("studentDetails").textContent = `USN: ${usn}`;

  // Hide search results
  hideSearchResults();

  // Fetch student details and enrolled subjects
  fetchStudentDetails(usn);
}

function hideSearchResults() {
  const searchResults = document.getElementById("searchResults");
  searchResults.classList.add("d-none");
}

function fetchStudentDetails(usn) {
  console.log("Fetching details for student:", usn); // Debug log

  const formData = new FormData();
  formData.append("student_search", usn);

  fetch("/instructor/get_student", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Received student data:", data); // Debug log

      if (data.success) {
        updateEnrolledSubjects(data.enrolled_subjects || []);
        document.getElementById("selectedStudent").classList.remove("d-none");
      } else {
        throw new Error(data.error || "Failed to load student details");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error loading student details: " + error.message);
    });
}
