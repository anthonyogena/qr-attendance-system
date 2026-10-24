// js/attendance.js
let attendanceRecords = [];

function generateQR() {
    const name = document.getElementById("studentName").value.trim();
    const schoolId = document.getElementById("schoolId").value.trim();
    const course = document.getElementById("course").value.trim();
    const qrContainer = document.getElementById("qrcode");
    const closeBtn = document.getElementById("closeQrBtn");

    if (!name || !schoolId || !course) {
        alert("Please fill in Name, School ID, and Course.");
        return;
    }

    qrContainer.innerHTML = "";
    const payload = JSON.stringify({ schoolId, name, course });

    // Generate the QR code
    new QRCode(qrContainer, {
        text: payload,
        width: 180,
        height: 180
    });

    closeBtn.style.display = "inline-block";
}

function closeQR() {
    document.getElementById("qrcode").innerHTML = "";
    document.getElementById("closeQrBtn").style.display = "none";
}

async function updateTable() {
    if (!sessionStorage.getItem("teacherLoggedIn")) return;

    const tableBody = document.getElementById("attendanceTable");
    const selectedMonthIndex = parseInt(document.getElementById("monthFilter").value, 10);
    const teacherId = getCurrentTeacherId();
    const year = new Date().getFullYear();

    tableBody.innerHTML = `<tr><td colspan="5" class="empty-msg">Loading records...</td></tr>`;

    try {
        // We add + 1 because JS months are 0-11, but Java months are 1-12
        attendanceRecords = await apiGetMonthlyAttendance(teacherId, selectedMonthIndex + 1, year);
        tableBody.innerHTML = "";

        if (attendanceRecords.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="empty-msg">No attendance logs found for this month.</td></tr>`;
            return;
        }

        attendanceRecords.forEach(record => {
            const row = document.createElement("tr");

            // Format the backend timestamp to look nice
            const dateObj = new Date(record.timestamp);
            const timeString = dateObj.toLocaleString();

            row.innerHTML = `
                <td>${escapeHTML(record.schoolId)}</td>
                <td>${escapeHTML(record.studentName)}</td>
                <td>${escapeHTML(record.course)}</td>
                <td class="status-present">Present</td>
                <td>${timeString}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" style="color:red;">Error: ${error.message}</td></tr>`;
    }
}

function exportMonthlyExcel() {
    const select = document.getElementById("monthFilter");
    const fullMonthName = select.options[select.selectedIndex].text;
    const teacherName = sessionStorage.getItem("teacherName");

    if (attendanceRecords.length === 0) {
        alert("No records to export for this month!");
        return;
    }

    // 1. Format the data exactly how we want it to appear in Excel columns
    const excelData = attendanceRecords.map(record => ({
        "School ID": record.schoolId,
        "Student Name": record.studentName,
        "Course": record.course,
        "Status": "Present",
        "Date & Time": new Date(record.timestamp).toLocaleString(),
        "Scanned By": teacherName
    }));

    // 2. Create the Excel Worksheet and Workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    // 3. Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // 4. Trigger the file download
    const fileName = `Attendance_${fullMonthName}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

async function clearAllData() {
    if (!confirm("Are you sure you want to delete ALL your attendance logs? This cannot be undone.")) {
        return;
    }

    try {
        const teacherId = getCurrentTeacherId();
        await apiClearLogs(teacherId);
        alert("All logs cleared successfully.");
        updateTable(); // Refresh the table (it will now show empty)
    } catch (error) {
        alert("Error: " + error.message);
    }
}