package com.qrattendance.system.controller;


import com.qrattendance.system.dto.AttendanceRequest;
import com.qrattendance.system.model.AttendanceRecord;
import com.qrattendance.system.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/record")
    public ResponseEntity<String> record(@Valid @RequestBody AttendanceRequest request){
        attendanceService.recordAttendance(
                request.getSchoolId(), request.getStudentName(), request.getCourse(), request.getTeacherId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Attendance record has been recorded successfully");
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<AttendanceRecord>> getMonthly(
            @RequestParam Long teacherId, @RequestParam int month, @RequestParam int year){

        List<AttendanceRecord> records = attendanceService.getMonthlyAttendance(teacherId, month, year);
        return ResponseEntity.ok(records);
    }

    @DeleteMapping("/clear")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<String> clearLogs(@RequestParam Long teacherId) {
        attendanceService.clearLogs(teacherId);
        return ResponseEntity.ok("All attendance logs cleared.");
    }



}
