function handleLogin(event) {
        
        
    const username = document.getElementById('username').value.trim();
    if (username) {
        // Save the username in localStorage
        localStorage.setItem('username', username);

        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] Login attempt - ${username}`;
        
        console.log(logEntry); // Log to console or display somewhere

        // Redirect to index.html
        window.location.href = "index.html";
    } else {
        alert('Please enter a username.');
    }
}