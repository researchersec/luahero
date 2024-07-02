document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Example login validation (replace with your actual logic)
    if (email === 'example@example.com' && password === 'password') {
        console.log('Login successful!');
        // Proceed with creating issues or other actions
        createIssue('Example Issue', 'This is an example issue.');
    } else {
        console.error('Login failed. Invalid credentials.');
    }
});

function createIssue(title, body) {
    const token = prompt("Enter your GitHub Personal Access Token:");

    if (!token) {
        console.error('GitHub Personal Access Token is required.');
        return;
    }

    fetch('https://api.github.com/repos/your-username/your-username.github.io/issues', {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            title: title,
            body: body
        })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(error => Promise.reject(error));
        }
        return response.json();
    }).then(data => {
        console.log('Issue created:', data);
    }).catch(error => {
        console.error('Error creating issue:', error);
    });
}
