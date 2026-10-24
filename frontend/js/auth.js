// js/auth.js

async function teacherSignup() {
    const name = document.getElementById("signupName").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const teacherCode = document.getElementById("signupTeacherCode").value.trim();
    const message = document.getElementById("signupMessage");

    message.textContent = "";

    if (!name || !username || !password || !confirmPassword || !teacherCode) {
        message.textContent = "Please complete all fields.";
        return;
    }
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    try {
        await apiSignup(name, username, password, teacherCode);
        alert("Teacher account created successfully!");

        document.getElementById("signupName").value = "";
        document.getElementById("signupUsername").value = "";
        document.getElementById("signupPassword").value = "";
        document.getElementById("signupConfirmPassword").value = "";
        document.getElementById("signupTeacherCode").value = "";

        showLogin();
        document.getElementById("teacherUsername").value = username;
    } catch (error) {
        message.textContent = error.message; // Shows the backend error (e.g., duplicate username)
    }
}

async function teacherLogin() {
    const username = document.getElementById("teacherUsername").value.trim();
    const password = document.getElementById("teacherPassword").value;
    const errorElement = document.getElementById("loginError");

    errorElement.textContent = "";

    try {
        const response = await apiLogin(username, password);

        sessionStorage.setItem("teacherLoggedIn", "true");
        sessionStorage.setItem("teacherId", response.id);
        sessionStorage.setItem("teacherName", response.name);

        document.getElementById("loggedTeacherName").textContent = response.name;
        document.getElementById("recordTeacherName").textContent = response.name;
        document.getElementById("monthFilter").value = new Date().getMonth();

        // Show teacher dashboard
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("teacherPage").classList.remove("hidden");

        updateTable();
    } catch (error) {
        errorElement.textContent = error.message;
    }
}

function teacherLogout() {
    sessionStorage.clear();
    showLogin();
}

function getCurrentTeacherId() {
    return sessionStorage.getItem("teacherId");
}

async function deleteAccountWithPassword() {
    const password = prompt("SECURITY VERIFICATION:\nPlease enter your password to delete this teacher account:");

    if (password === null) return; // User clicked Cancel

    if (!confirm("Are you SURE? This will permanently delete your account and all attendance logs.")) {
        return;
    }

    try {
        const teacherId = getCurrentTeacherId();
        await apiDeleteAccount(teacherId, password);

        alert("Your account has been permanently deleted.");
        teacherLogout(); // This clears session and goes to login screen
    } catch (error) {
        alert("Error: " + error.message);
    }
}