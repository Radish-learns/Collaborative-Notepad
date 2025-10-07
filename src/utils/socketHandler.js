<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Notepad</title>
    <link rel="stylesheet" href="/css/critical.css">
    <link rel="stylesheet" href="/css/style.css">
    <script src="/socket.io/socket.io.js"></script>
</head>
<body class="light-mode">

<header>
    <div class="header-content">
        <div class="logo">
            <i class="fa fa-edit"></i>
            <h1>Collaborative Notepad</h1>
        </div>
        <div class="controls">
            <div class="url-control">
                <input type="text" id="noteUrl" placeholder="Enter note URL">
                <button id="joinNote">Join</button>
            </div>
            <button id="themeToggle">🌙</button>
        </div>
    </div>
</header>

<div class="container">
    <!-- Formatting toolbar -->
    <div id="toolbar">
        <button onclick="formatText('bold')"><b>B</b></button>
        <button onclick="formatText('italic')"><i>I</i></button>
        <button onclick="formatText('underline')"><u>U</u></button>
        <button onclick="formatText('hiliteColor', 'yellow')">🟨</button>
        <button onclick="removeFormatting()">❌</button>
    </div>

    <!-- Editable note -->
    <div id="notepad" contenteditable="true"></div>
</div>

<footer>
    <div class="footer-content">
        <div class="footer-links">
            <span>Active Users: <span id="userCount">0</span></span>
        </div>
    </div>
</footer>

<script>
const socket = io();

// Join a note
document.getElementById('joinNote').addEventListener('click', () => {
    const url = document.getElementById('noteUrl').value.trim();
    if (!url) return alert('Enter a note URL!');
    socket.emit('joinNote', url);
});

// Real-time note updates
const notepad = document.getElementById('notepad');
notepad.addEventListener('input', () => {
    socket.emit('updateNote', {
        url: document.getElementById('noteUrl').value.trim(),
        content: notepad.innerHTML
    });
});

// Load note content
socket.on('loadNote', (note) => {
    notepad.innerHTML = note.content || '';
});

// Update from other users
socket.on('noteUpdated', (content) => {
    notepad.innerHTML = content;
});

// Update active users
socket.on('userCount', (count) => {
    document.getElementById('userCount').innerText = count;
});

// Formatting functions
function formatText(command, value=null){
    document.execCommand(command, false, value);
}

function removeFormatting() {
    document.execCommand('removeFormat', false, null);
}

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});
</script>

</body>
</html>
