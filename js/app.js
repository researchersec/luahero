document.getElementById('registerBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const issueTitle = 'register';
    const issueBody = `Email: ${email}\nPassword: ${password}`;

    createIssue(issueTitle, issueBody);
});

document.getElementById('loginBtn').addEventListener('click', () => {
    // Implement login by checking the stored user data in issues
});

document.getElementById('uploadBtn').addEventListener('click', () => {
    const file = document.getElementById('fileInput').files[0];
    const user = 'example-user'; // Get the logged-in user's info

    if (user && file) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            const issueTitle = 'upload';
            const issueBody = `User: ${user}\nFile Content: ${fileContent}`;

            createIssue(issueTitle, issueBody);
        };
        reader.readAsText(file);
    } else {
        console.error('No user or file selected');
    }
});

function createIssue(title, body) {
    const token = prompt("Enter your GitHub Personal Access Token:");

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
    }).then(response => response.json()).then(data => {
        console.log('Issue created:', data);
    }).catch(error => {
        console.error('Error creating issue:', error);
    });
}
