package com.qrattendance.system.service;

import com.qrattendance.system.model.AttendanceRecord;

import java.util.List;


public interface AttendanceService {

    void clearLogs(Long teacherId);

    void recordAttendance(String schoolId, String studentName, String course, Long teacherId);

    List<AttendanceRecord> getMonthlyAttendance(Long teacherId, int month, int year);


}
