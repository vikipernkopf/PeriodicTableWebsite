function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const maxLength = 20;

    if (username.length > maxLength) {
        alert(`Username must be ${maxLength} characters or less.`);

        return;
    }

    if (username) {
        //save the username in local storage
        localStorage.setItem('username', username);

        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] Login attempt - ${username}`;
        console.log(logEntry); //log to console or display somewhere
        window.location.href = "../index.html";
    } else {
        alert('Please enter a username.');
    }
}