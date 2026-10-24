# 📸 QR Code Attendance System

A full-stack, centralized attendance tracking system designed for educational institutions. Teachers can securely log in, scan student-generated QR codes using their device camera, and export monthly attendance reports to Excel.

Built with **Spring Boot**, **SQLite**, and **Vanilla JavaScript**.

## ✨ Features

### 👨‍🏫 Teacher Features
- **Secure Authentication:** Signup and login using BCrypt password hashing (requires an institutional Teacher Code).
- **Live QR Scanner:** Uses the device camera to scan student QR codes instantly.
- **Duplicate Prevention:** Backend logic ensures a student cannot be marked "Present" twice on the same day.
- **Monthly Dashboard:** Fetch and view attendance records filtered by month and year.
- **Excel Export:** Download a clean `.xlsx` file of the monthly attendance log using SheetJS.
- **Data Management:** Option to clear attendance logs or permanently delete the teacher account.

### 🎓 Student Features
- **No Account Required:** Students simply enter their Name, School ID, and Course to generate a temporary JSON-based QR code.

## 🛠️ Tech Stack

**Backend:**
- **Java 17** & **Spring Boot 3**
- **Spring Data JPA** & Hibernate
- **SQLite** (Local, file-based database)
- **Spring Security** (BCrypt password encoding)
- **SpringDoc OpenAPI (Swagger UI)** for API documentation
- **JUnit 5 & Mockito** for unit testing

**Frontend:**
- **HTML5 / CSS3 / Vanilla JavaScript**
- **html5-qrcode** (Camera scanning)
- **qrcodejs** (QR generation)
- **SheetJS** (Excel file generation)

## 🏗️ Architecture

The backend follows a strict **N-Tier (Layered) Architecture**:
- **Controllers:** Handle HTTP requests and validation.
- **Services:** Contain core business logic (e.g., password matching, duplicate checks).
- **Repositories:** Interface with the SQLite database via Spring Data JPA.
- **DTOs:** Separate internal database entities from external API payloads.
- **Global Exception Handler:** Ensures the frontend always receives clean, structured `ApiError` JSON responses.

## 🚀 How to Run Locally

### 1. Backend Setup
1. Open the `backend` folder in IntelliJ IDEA (or your preferred IDE).
2. Ensure you have Java 17 installed.
3. The database will automatically generate at `backend/data/attendance.db` upon first run.
4. Run `QrAttendanceSystemApplication.java`.
5. The backend will start at `http://localhost:8080`.
6. Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

### 2. Frontend Setup
1. Open the `frontend/index.html` file using a local web server.
   - *Option A (IntelliJ):* Right-click `index.html` -> **Open In** -> **Browser**.
   - *Option B (VS Code):* Use the **Live Server** extension.
   - *Option C (Python):* Run `python -m http.server 8000` inside the `frontend` folder.
2. **Note:** Do not open the HTML file directly via `file:///` as browsers block camera access on local files.

### 🔑 Teacher Registration Code
To register as a teacher, you must use the secret registration code configured in `application.properties`:
- Default Code: `DEMO_SIGNUP_2026`

## 📡 API Endpoints (v1)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Register a new teacher |
| `POST` | `/api/v1/auth/login` | Authenticate and retrieve teacher details |
| `DELETE`| `/api/v1/auth/delete` | Delete teacher account and associated logs |
| `POST` | `/api/v1/attendance/record` | Record a new student scan |
| `GET` | `/api/v1/attendance/monthly` | Get attendance records by month/year |
| `DELETE`| `/api/v1/attendance/clear` | Clear all logs for a specific teacher |

## 🧪 Testing
The backend includes unit tests for the Service Layer using JUnit 5 and Mockito. 
To run the tests:
```bash
cd backend
./mvnw test
