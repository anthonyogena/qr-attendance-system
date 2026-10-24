package com.qrattendance.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AttendanceRequest {

    @NotBlank(message = "SchoolId is required")
    private String  schoolId;

    @NotBlank(message = "Student Name is required")
    private String  studentName;

    @NotBlank(message = "Course is required")
    private String  course;

    @NotNull(message = "Teacher ID is required")
    private Long  teacherId;

    public AttendanceRequest() {
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
}
