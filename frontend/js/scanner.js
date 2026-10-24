// js/scanner.js
let html5QrCode = null;
let scanCooldown = false;

function startCamera() {
    if (!sessionStorage.getItem("teacherLoggedIn")) {
        alert("Teacher access required.");
        showLogin();
        return;
    }
    if (html5QrCode) return;

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "user" },
        { fps: 15, useBarCodeDetectorIfSupported: true  },
        onScanSuccess
    ).then(() => {
        document.getElementById("startScanBtn").style.display = "none";
        document.getElementById("stopScanBtn").style.display = "inline-block";
    }).catch(error => {
        html5QrCode = null;
        alert("Camera error: " + error);
    });
}

function stopCamera() {
    if (!html5QrCode) return;

    html5QrCode.stop().then(() => {
        html5QrCode = null;
        document.getElementById("startScanBtn").style.display = "inline-block";
        document.getElementById("stopScanBtn").style.display = "none";
        document.getElementById("reader").innerText = 'Click "Start Camera" and allow permission';
    }).catch(() => {
        html5QrCode = null;
    });
}

async function onScanSuccess(decodedText) {
    if (scanCooldown) return;
    scanCooldown = true;
    setTimeout(() => { scanCooldown = false; }, 2500);

    try {
        const data = JSON.parse(decodedText);
        if (!data.schoolId) {
            alert("Invalid student QR Code.");
            return;
        }

        const teacherId = getCurrentTeacherId();

        // Send to Spring Boot!
        await apiRecordAttendance(data.schoolId, data.name, data.course, teacherId);

        alert(`Attendance marked for ${data.name}!`);

        // Refresh the table to show the new record
        updateTable();

    } catch (error) {
        // This will show "Attendance record already exists" if they scan twice
        alert(error.message);
    }
}