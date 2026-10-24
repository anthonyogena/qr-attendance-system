package com.qrattendance.system.service.impl;

import com.qrattendance.system.exception.DuplicateAttendanceException;
import com.qrattendance.system.model.AttendanceRecord;
import com.qrattendance.system.model.Teacher;
import com.qrattendance.system.repository.AttendanceRepository;
import com.qrattendance.system.repository.TeacherRepository;
import com.qrattendance.system.service.AttendanceService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final TeacherRepository teacherRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, TeacherRepository teacherRepository) {
        this.attendanceRepository = attendanceRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public void recordAttendance(String schoolId, String studentName, String course, Long teacherId) {


        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsBySchoolIdAndDateOnly(schoolId, today)){
            throw new DuplicateAttendanceException("Attendance record already exists");
        }

        AttendanceRecord attendanceRecord = new AttendanceRecord();
        attendanceRecord.setSchoolId(schoolId);
        attendanceRecord.setStudentName(studentName);
        attendanceRecord.setCourse(course);
        attendanceRecord.setTimestamp(LocalDateTime.now());
        attendanceRecord.setTeacher(teacher);
        attendanceRecord.setDateOnly(today);
        attendanceRepository.save(attendanceRecord);

    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecord> getMonthlyAttendance(Long teacherId, int month, int year) {

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return attendanceRepository.findByTeacherIdAndDateOnlyBetween(teacherId, startDate, endDate);
    }

    @Override
    @Transactional
    public void clearLogs(Long teacherId) {
        attendanceRepository.deleteByTeacherId(teacherId);
    }

}
