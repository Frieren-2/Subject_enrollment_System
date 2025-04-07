// Handle enrollment
function enrollSubject(subjectId) {
    if (confirm('Are you sure you want to enroll in this subject?')) {
        // Here you would make an AJAX call to your enrollment endpoint
        console.log('Enrolling in subject:', subjectId);
    }
}

// Handle subject dropping
function dropSubject(subjectId) {
    if (confirm('Are you sure you want to drop this subject?')) {
        // Here you would make an AJAX call to your drop subject endpoint
        console.log('Dropping subject:', subjectId);
    }
}

// Add new subject modal
function showAddSubjectModal() {
    // Implementation for showing add subject modal
    alert('Add new subject functionality will be implemented here');
}
