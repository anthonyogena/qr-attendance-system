let attendanceRecords = [];

let html5QrCode = null;

let scanCooldown = false;   // FIX: prevents repeated scans of the same QR


/* ================================
   TEACHER ACCOUNT SYSTEM
   ================================ */

function getTeachers() {

    const saved =
        localStorage.getItem("teacherAccounts");

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    }

    catch (error) {
        return [];
    }
}


function saveTeachers(teachers) {

    localStorage.setItem(
        "teacherAccounts",
        JSON.stringify(teachers)
    );

}


/* ================================
   SIGN UP
   ================================ */

function teacherSignup() {

    const name =
        document
        .getElementById("signupName")
        .value
        .trim();

    const username =
        document
        .getElementById("signupUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("signupPassword")
        .value;

    const confirmPassword =
        document
        .getElementById("signupConfirmPassword")
        .value;

    const message =
        document
        .getElementById("signupMessage");


    message.textContent = "";


    if (
        !name ||
        !username ||
        !password ||
        !confirmPassword
    ) {

        message.textContent =
            "Please complete all fields.";

        return;
    }


    if (username.length < 4) {

        message.textContent =
            "Username must be at least 4 characters.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    const teachers =
        getTeachers();


    const existing =
        teachers.find(
            teacher =>
                teacher.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (existing) {

        message.textContent =
            "That username is already registered.";

        return;
    }


    const newTeacher = {

        id:
            Date.now().toString(),

        name:
            name,

        username:
            username,

        password:
            password

    };


    teachers.push(newTeacher);


    saveTeachers(teachers);


    alert(
        "Teacher account created successfully!"
    );


    document
        .getElementById("signupName")
        .value = "";

    document
        .getElementById("signupUsername")
        .value = "";

    document
        .getElementById("signupPassword")
        .value = "";

    document
        .getElementById("signupConfirmPassword")
        .value = "";

    message.textContent = "";


    showLogin();


    document
        .getElementById("teacherUsername")
        .value = username;

}


/* ================================
   LOGIN
   ================================ */

function teacherLogin() {

    const username =
        document
        .getElementById("teacherUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("teacherPassword")
        .value;


    const teachers =
        getTeachers();


    const teacher =
        teachers.find(
            t =>
                t.username.toLowerCase() ===
                username.toLowerCase() &&
                t.password === password
        );


    if (!teacher) {

        document
            .getElementById("loginError")
            .textContent =
            "Invalid username or password.";

        return;
    }


    sessionStorage.setItem(
        "teacherLoggedIn",
        "true"
    );


    sessionStorage.setItem(
        "teacherId",
        teacher.id
    );


    sessionStorage.setItem(
        "teacherUsername",
        teacher.username
    );


    sessionStorage.setItem(
        "teacherName",
        teacher.name
    );


    document
        .getElementById("loginScreen")
        .classList
        .add("hidden");


    document
        .getElementById("signupScreen")
        .classList
        .add("hidden");


    document
        .getElementById("studentPage")
        .classList
        .add("hidden");


    document
        .getElementById("teacherPage")
        .classList
        .remove("hidden");


    document
        .getElementById("loggedTeacherName")
        .textContent =
        teacher.name;


    document
        .getElementById("recordTeacherName")
        .textContent =
        teacher.name;


    document
        .getElementById("monthFilter")
        .value =
        new Date().getMonth();


    loadTeacherAttendance();

    updateTable();

}


/* ================================
   LOGIN / SIGNUP SCREEN
   ================================ */

function showLogin() {

    document
        .getElementById("loginScreen")
        .classList
        .remove("hidden");


    document
        .getElementById("signupScreen")
        .classList
        .add("hidden");


    document
        .getElementById("studentPage")
        .classList
        .add("hidden");


    document
        .getElementById("teacherPage")
        .classList
        .add("hidden");


    document
        .getElementById("loginError")
        .textContent = "";

}


function showSignup() {

    document
        .getElementById("loginScreen")
        .classList
        .add("hidden");


    document
        .getElementById("signupScreen")
        .classList
        .remove("hidden");


    document
        .getElementById("studentPage")
        .classList
        .add("hidden");


    document
        .getElementById("teacherPage")
        .classList
        .add("hidden");


    document
        .getElementById("signupMessage")
        .textContent = "";

}


function continueAsStudent() {

    document
        .getElementById("loginScreen")
        .classList
        .add("hidden");


    document
        .getElementById("signupScreen")
        .classList
        .add("hidden");


    document
        .getElementById("studentPage")
        .classList
        .remove("hidden");


    document
        .getElementById("teacherPage")
        .classList
        .add("hidden");

}


/* ================================
   LOGOUT
   ================================ */

function teacherLogout() {

    if (html5QrCode) {

        html5QrCode
            .stop()
            .catch(() => { });

        html5QrCode = null;

    }


    sessionStorage.removeItem(
        "teacherLoggedIn"
    );

    sessionStorage.removeItem(
        "teacherId"
    );

    sessionStorage.removeItem(
        "teacherUsername"
    );

    sessionStorage.removeItem(
        "teacherName"
    );


    showLogin();

}


/* ================================
   TEACHER ATTENDANCE STORAGE
   ================================ */

function getCurrentTeacherId() {

    return sessionStorage.getItem(
        "teacherId"
    );

}


function getAllAttendance() {

    const saved =
        localStorage.getItem(
            "attendanceLogs"
        );

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    }

    catch (error) {
        return [];
    }

}


function saveAllAttendance(records) {

    localStorage.setItem(
        "attendanceLogs",
        JSON.stringify(records)
    );

}


function loadTeacherAttendance() {

    const allRecords =
        getAllAttendance();


    const teacherId =
        getCurrentTeacherId();


    attendanceRecords =
        allRecords.filter(
            record =>
                record.teacherId === teacherId
        );

}


function saveTeacherAttendance() {

    const allRecords =
        getAllAttendance();


    const teacherId =
        getCurrentTeacherId();


    const otherTeachersRecords =
        allRecords.filter(
            record =>
                record.teacherId !== teacherId
        );


    const combined =
        otherTeachersRecords.concat(
            attendanceRecords
        );


    saveAllAttendance(combined);

}


/* ================================
   CLEAR ATTENDANCE
   ================================ */

function clearAllData() {

    if (
        !sessionStorage.getItem(
            "teacherLoggedIn"
        )
    ) {

        alert(
            "Teacher access required."
        );

        showLogin();

        return;

    }


    if (
        confirm(
            "Delete all your attendance records?"
        )
    ) {

        attendanceRecords = [];

        saveTeacherAttendance();

        updateTable();

    }

}


/* ================================
   DELETE TEACHER ACCOUNT WITH PASSWORD
   ================================ */

function deleteAccountWithPassword() {

    if (
        !sessionStorage.getItem(
            "teacherLoggedIn"
        )
    ) {

        alert(
            "Teacher access required."
        );

        showLogin();

        return;

    }


    const inputPassword =
        prompt(
            "SECURITY VERIFICATION:\nPlease enter your password to delete this teacher account:"
        );


    if (
        inputPassword === null
    ) {

        return; // User clicked Cancel

    }


    const currentId =
        getCurrentTeacherId();


    const teachers =
        getTeachers();


    const currentTeacher =
        teachers.find(
            t =>
                t.id === currentId
        );


    if (
        !currentTeacher ||
        currentTeacher.password !== inputPassword
    ) {

        alert(
            "Incorrect password! Account deletion cancelled."
        );

        return;

    }


    if (
        confirm(
            "Are you sure you want to permanently delete your account and all associated attendance records? This action cannot be undone."
        )
    ) {

        // 1. Remove teacher from account list
        const updatedTeachers =
            teachers.filter(
                t =>
                    t.id !== currentId
            );


        saveTeachers(
            updatedTeachers
        );


        // 2. Remove all attendance logs belonging to this teacher
        attendanceRecords = [];

        saveTeacherAttendance();


        alert(
            "Your teacher account has been permanently deleted."
        );


        // 3. Log out to login screen
        teacherLogout();

    }

}


/* ================================
   QR GENERATION
   ================================ */

function generateQR() {

    const name =
        document
        .getElementById("studentName")
        .value
        .trim();

    const schoolId =
        document
        .getElementById("schoolId")
        .value
        .trim();

    const course =
        document
        .getElementById("course")
        .value
        .trim();


    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    const closeBtn =
        document.getElementById(
            "closeQrBtn"
        );


    if (
        !name ||
        !schoolId ||
        !course
    ) {

        alert(
            "Please fill in Name, School ID, and Course."
        );

        return;

    }


    qrContainer.innerHTML = "";


    const payload =
        JSON.stringify({

            schoolId:
                schoolId,

            name:
                name,

            course:
                course

        });


    new QRCode(
        qrContainer,
        {

            text:
                payload,

            width:
                180,

            height:
                180

        }
    );


    closeBtn.style.display =
        "inline-block";

}


function closeQR() {

    document
        .getElementById("qrcode")
        .innerHTML = "";


    document
        .getElementById("closeQrBtn")
        .style.display =
        "none";

}


/* ================================
   CAMERA
   ================================ */

function startCamera() {

    if (
        !sessionStorage.getItem(
            "teacherLoggedIn"
        )
    ) {

        alert(
            "Teacher access required."
        );

        showLogin();

        return;

    }


    if (html5QrCode) {
        return;
    }


    html5QrCode =
        new Html5Qrcode(
            "reader"
        );


    html5QrCode.start(

        {
            facingMode:
                "environment"
        },

        {
            fps:
                10,

            qrbox: {
                width:
                    220,

                height:
                    220
            }

        },

        onScanSuccess

    )

        .then(() => {

            document
                .getElementById(
                    "startScanBtn"
                )
                .style.display =
                "none";


            document
                .getElementById(
                    "stopScanBtn"
                )
                .style.display =
                "inline-block";

        })

        .catch(error => {

            html5QrCode = null;

            alert(
                "Camera error: " + error
            );

        });

}


function stopCamera() {

    if (!html5QrCode) {
        return;
    }


    html5QrCode
        .stop()
        .then(() => {

            html5QrCode = null;


            document
                .getElementById(
                    "startScanBtn"
                )
                .style.display =
                "inline-block";


            document
                .getElementById(
                    "stopScanBtn"
                )
                .style.display =
                "none";


            const reader =
                document.getElementById(
                    "reader"
                );


            reader.innerText =
                'Click "Start Camera" and allow permission';

        })

        .catch(() => {

            html5QrCode = null;

        });

}


/* ================================
   QR SCAN
   ================================ */

function onScanSuccess(decodedText) {

    // FIX: cooldown to avoid repeated scans of the same QR
    if (scanCooldown) return;

    scanCooldown = true;
    setTimeout(() => { scanCooldown = false; }, 2500);


    if (
        !sessionStorage.getItem(
            "teacherLoggedIn"
        )
    ) {

        stopCamera();

        showLogin();

        return;

    }


    try {

        const data =
            JSON.parse(
                decodedText
            );


        if (!data.schoolId) {

            alert(
                "Invalid student QR Code."
            );

            return;

        }


        const now =
            new Date();


        const monthIndex =
            now.getMonth();


        const monthNameShort =
            now.toLocaleString(
                "default",
                {
                    month:
                        "short"
                }
            );


        const day =
            now.getDate();


        const time =
            now.toLocaleTimeString(
                "en-US",
                {
                    hour:
                        "numeric",

                    minute:
                        "2-digit",

                    hour12:
                        true
                }
            );


        const timeString =
            `${monthNameShort} ${day}, ${time}`;


        const dateOnly =
            `${now.getFullYear()}-${monthIndex}-${day}`;


        const alreadyScannedToday =
            attendanceRecords.some(
                record =>
                    record.schoolId ===
                    data.schoolId &&
                    record.dateOnly ===
                    dateOnly
            );


        if (
            alreadyScannedToday
        ) {

            alert(
                `${data.name} has already been marked present today!`
            );

            return;

        }


        const teacherId =
            getCurrentTeacherId();


        attendanceRecords.unshift({

            teacherId:
                teacherId,

            schoolId:
                data.schoolId,

            name:
                data.name ||
                "Unknown",

            course:
                data.course ||
                "N/A",

            timestamp:
                timeString,

            monthIndex:
                monthIndex,

            dateOnly:
                dateOnly

        });


        saveTeacherAttendance();

        updateTable();


        alert(
            `Attendance marked for ${data.name}!`
        );

    }

    catch (error) {

        alert(
            "Invalid QR Code scanned!"
        );

    }

}


/* ================================
   UPDATE TABLE
   ================================ */

function updateTable() {

    if (
        !sessionStorage.getItem(
            "teacherLoggedIn"
        )
    ) {

        return;

    }


    const tableBody =
        document.getElementById(
            "attendanceTable"
        );


    const selectedMonthIndex =
        parseInt(
            document
                .getElementById(
                    "monthFilter"
                )
                .value,

            10
        );


    tableBody.innerHTML = "";


    const filteredRecords =
        attendanceRecords.filter(
            record =>
                record.monthIndex ===
                selectedMonthIndex
        );


    if (
        filteredRecords.length === 0
    ) {

        tableBody.innerHTML =

            `<tr>
                <td colspan="5"
                    class="empty-msg">
                    No attendance logs found.
                </td>
            </tr>`;

        return;

    }


    filteredRecords.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(record.schoolId)}
                </td>

                <td>
                    ${escapeHTML(record.name)}
                </td>

                <td>
                    ${escapeHTML(record.course)}
                </td>

                <td class="status-present">
                    Present
                </td>

                <td>
                    ${escapeHTML(record.timestamp)}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/* ================================
   PROTECTION AGAINST HTML INPUT
   ================================ */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ================================
   CSV EXPORT
   ================================ */

function exportMonthlyCSV() {

    if (
        !sessionStorage.getItem(
            "teacherLoggedIn"
        )
    ) {

        alert(
            "Teacher access required."
        );

        showLogin();

        return;

    }


    const select =
        document.getElementById(
            "monthFilter"
        );


    const selectedMonthIndex =
        parseInt(
            select.value,
            10
        );


    // FIX: use selectedIndex to get the correct month name
    const fullMonthName =
        select.options[select.selectedIndex].text;


    const filteredRecords =
        attendanceRecords.filter(
            record =>
                record.monthIndex ===
                selectedMonthIndex
        );


    if (
        filteredRecords.length === 0
    ) {

        alert(
            "No records to export for this month!"
        );

        return;

    }


    const year =
        new Date().getFullYear();


    const teacherName =
        sessionStorage.getItem(
            "teacherName"
        );


    const fileName =
        `Attendance_${fullMonthName}_${year}.csv`;


    let csvString =
        "School ID,Name,Course,Status,Date & Time,Teacher\n";


    filteredRecords.forEach(
        record => {

            const cleanId =
                String(record.schoolId)
                    .replace(/"/g, '""');


            const cleanName =
                String(record.name)
                    .replace(/"/g, '""');


            const cleanCourse =
                String(record.course)
                    .replace(/"/g, '""');


            const cleanTeacher =
                String(teacherName)
                    .replace(/"/g, '""');


            csvString +=
                `"${cleanId}","${cleanName}","${cleanCourse}","Present","${record.timestamp}","${cleanTeacher}"\n`;

        }
    );


    const blob =
        new Blob(
            [csvString],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        fileName;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* ================================
   PAGE LOAD
   ================================ */

window.onload =
    function () {

        showLogin();

    };