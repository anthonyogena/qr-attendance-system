// ui.js
function showLogin() {
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("signupScreen").classList.add("hidden");
    document.getElementById("studentPage").classList.add("hidden");
    document.getElementById("teacherPage").classList.add("hidden");
    document.getElementById("loginError").textContent = "";
}

function showSignup() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("signupScreen").classList.remove("hidden");
    document.getElementById("studentPage").classList.add("hidden");
    document.getElementById("teacherPage").classList.add("hidden");
    document.getElementById("signupMessage").textContent = "";
}

function continueAsStudent() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("signupScreen").classList.add("hidden");
    document.getElementById("studentPage").classList.remove("hidden");
    document.getElementById("teacherPage").classList.add("hidden");
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}