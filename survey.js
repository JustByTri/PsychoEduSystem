document.getElementById('startSurveyButton').addEventListener('click', function() {
    // Check if the user is logged in
    const isLoggedIn = checkUserLoggedIn(); // Implement this function based on your authentication logic

    if (isLoggedIn) {
        // Redirect to the survey page
        window.location.href = '/surveyPage.html'; // Change this to your survey page URL
    } else {
        // Display message and redirect to login page
        alert('You need to log in to take the survey');
        window.location.href = '/login.html'; // Change this to your login page URL
    }
});

function checkUserLoggedIn() {
    // Implement your logic to check if the user is logged in
    // This is just a placeholder implementation
    return !!localStorage.getItem('userToken');
}
