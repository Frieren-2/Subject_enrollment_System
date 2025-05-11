// Global variables
let recommendedSubjects = [];
let currentUnits = 12;
const maxUnits = 18;
let allSubjects = []; // Will store all subjects for filtering

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
};

// Show demo student
function showDemoStudent() {
  document.getElementById("noStudentSelected").style.display = "none";
  document.getElementById("studentDetails").style.display = "block";
}

// Simulate search functionality for students
function searchStudent() {
  const searchInput = document.getElementById("studentSearch").value.trim();

  if (searchInput === "") {
    alert("Please enter a student name or ID");
    return;
  }

  // In a real app, this would make an API call to search for the student
  // For demo purposes, we'll just show the demo student
  showDemoStudent();

  // Update the search field with a success message
  document.getElementById("studentSearch").value = searchInput + " (Found)";
}

// Search subjects functionality
function searchSubjects() {
  const searchInput = document
    .getElementById("subjectSearch")
    .value.trim()
    .toLowerCase();

  if (searchInput === "") {
    // Reset the filter
    resetSubjectFilter();
    return;
  }

  // Filter the subjects
  filterSubjectsByText(searchInput);
}

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
