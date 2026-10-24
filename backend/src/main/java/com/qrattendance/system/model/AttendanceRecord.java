package com.qrattendance.system.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity (name = "AttendanceRecord")
@Table (name = "attendance_records")
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "school_id",
            nullable = false
    )
    private String schoolId;

    @Column(name = "student_name",
            nullable = false
    )
    private String studentName;

    @Column(name = "course",
            nullable = false
    )
    private String course;

    @Column(name = "timestamp",
            nullable = false
    )
    private LocalDateTime timestamp;

    @Column(name = "attendance_date",
            nullable = false
    )
    private LocalDate dateOnly;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id",
                nullable = false
    )
    private Teacher teacher;

    public AttendanceRecord() {

    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public LocalDate getDateOnly() {
        return dateOnly;
    }

    public void setDateOnly(LocalDate dateOnly) {
        this.dateOnly = dateOnly;
    }
}
