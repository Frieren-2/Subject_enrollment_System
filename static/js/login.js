// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            // Form validation will be handled by HTML5 required attributes
            const studentId = this.student_id.value;
            const password = this.password.value;
            
            // Additional client-side validation could be added here
            if (studentId.trim() === '' || password.trim() === '') {
                e.preventDefault();
                alert('Please fill in all fields');
            }
        });
    }
});
