let loggedInUser = null; // Global variable to store logged-in user information

document.getElementById('registerBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const issueTitle = 'register';
    const issueBody = `Email: ${email}\nPassword: ${password}`;

    createIssue(issueTitle, issueBody);
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login validation (replace with actual authentication logic)
    if (email === 'hojlund@hojlund.dk' && password === 'testing123!') {
        loggedInUser = email; // Set logged-in user
        console.log('Logged in as:', loggedInUser);
        alert('Login successful!');
    } else {
        console.error('Invalid credentials');
        alert('Login failed. Invalid credentials.');
    }
});

document.getElementById('uploadBtn').addEventListener('click', () => {
    const file = document.getElementById('fileInput').files[0];

    if (!loggedInUser) {
        alert('Please log in before uploading');
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            splitAndCreateIssues(loggedInUser, fileContent);
        };
        reader.readAsText(file);
    } else {
        console.error('No file selected');
        alert('Please select a file to upload');
    }
});

function splitAndCreateIssues(user, fileContent) {
    const maxLength = 65536;
    const chunks = [];
    for (let i = 0; i < fileContent.length; i += maxLength) {
        chunks.push(fileContent.slice(i, i + maxLength));
    }

    chunks.forEach((chunk, index) => {
        const issueTitle = `upload part ${index + 1}`;
        const issueBody = `User: ${user}\nFile Content: ${chunk}`;
        createIssue(issueTitle, issueBody);
    });
}

function createIssue(title, body) {
    const token = prompt("Enter your GitHub Personal Access Token:");

    if (!title || !body) {
        console.error('Title or body is empty');
        return;
    }

    fetch('https://api.github.com/repos/researchersec/luahero/issues', {
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
        if (data.message === "Bad credentials") {
            console.error('Error creating issue: Bad credentials', data);
        } else if (data.errors) {
            console.error('Validation Failed:', data.errors);
        } else {
            console.log('Issue created:', data);
        }
    }).catch(error => {
        console.error('Error creating issue:', error);
    });
}
