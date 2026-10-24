// js/api.js
const API_BASE_URL = "http://localhost:8080/api/v1";

// 1. Login Request
async function apiLogin(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

// 2. Signup Request
async function apiSignup(name, username, password, teacherCode) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, teacherCode })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.text();
}

// 3. Record Attendance (POST)
async function apiRecordAttendance(schoolId, studentName, course, teacherId) {
    const response = await fetch(`${API_BASE_URL}/attendance/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId, studentName, course, teacherId })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.text();
}

// 4. Get Monthly Attendance (GET)
async function apiGetMonthlyAttendance(teacherId, month, year) {
    const url = `${API_BASE_URL}/attendance/monthly?teacherId=${teacherId}&month=${month}&year=${year}`;

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
}

// 5. Clear Logs (DELETE)
async function apiClearLogs(teacherId) {
    const response = await fetch(`${API_BASE_URL}/attendance/clear?teacherId=${teacherId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.text();
}

// 6. Delete Teachers
async function apiDeleteAccount(teacherId, password) {
    const response = await fetch(`${API_BASE_URL}/auth/delete?teacherId=${teacherId}&password=${encodeURIComponent(password)}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.text();
}