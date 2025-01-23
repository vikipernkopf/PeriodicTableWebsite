function handleLogin() {
    const username = document.getElementById('username').value.trim();

    if (username) {
        //save the username in local storage
        localStorage.setItem('username', username);

        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] Login attempt - ${username}`;
        console.log(logEntry); //log to console or display somewhere

        //redirect to index.html
        window.location.href = "periodic-table.html";
    } else {
        alert('Please enter a username.');
    }
}

function printGroups() {
    const groups = File.read('C:\\Users\\Antonio\\Desktop\\School\\Y2\\WMC\\ProgramDescriptionWebsite\\Files\\Groups');
    const groupsArray = groups.split(';');

    let tableHeaders = '';
    for (let i = 0; i < groupsArray.length; i++) {
        tableHeaders += `<th>${groupsArray[i]}</th>`;
    }

    document.getElementById('groups').innerHTML = `<tr>${tableHeaders}</tr>`;
}