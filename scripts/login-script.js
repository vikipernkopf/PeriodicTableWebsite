/**
 * Handles the login process by validating the username, saving it to local storage,
 * and redirecting the user to the homepage if valid.
 */
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const maxLength = 20;

    const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");

    if (username.length > maxLength) {
        alert(`Username must be ${maxLength} characters or less.`);

        return;
    }

    if (username) {
        //save the username in local storage
        localStorage.setItem('username', username);

        const redirectUrl = redirectAfterLogin || "../index.html";
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectUrl;
    } else {
        alert('Please enter a username.');
    }
}