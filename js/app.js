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
            if (fileContent.length > 65536) {
                splitAndCreateIssues(user, fileContent);
            } else {
                const issueTitle = 'upload';
                const issueBody = `User: ${user}\nFile Content: ${fileContent}`;
                createIssue(issueTitle, issueBody);
            }
        };
        reader.readAsText(file);
    } else {
        console.error('No user or file selected');
    }
});

function splitAndCreateIssues(user, fileContent) {
    const maxLength = 65536;
    const parts = Math.ceil(fileContent.length / maxLength);
    for (let i = 0; i < parts; i++) {
        const partContent = fileContent.slice(i * maxLength, (i + 1) * maxLength);
        const issueTitle = `upload part ${i + 1}`;
        const issueBody = `User: ${user}\nFile Content: ${partContent}`;
        createIssue(issueTitle, issueBody);
    }
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
