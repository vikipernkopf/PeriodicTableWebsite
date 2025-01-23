function handleLogin() {
    const username = document.getElementById('username').value.trim();

    if (username) {
        //save the username in local storage
        localStorage.setItem('username', username);

        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] Login attempt - ${username}`;
        console.log(logEntry); //log to console or display somewhere

        //redirect to index.html
        window.location.href = "index.html";
    } else {
        alert('Please enter a username.');
    }
}

/*function printGroups() {
    const groups = ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'];
}*/