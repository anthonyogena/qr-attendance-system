package com.qrattendance.system.service.impl;

import com.qrattendance.system.exception.DuplicateAttendanceException;
import com.qrattendance.system.model.AttendanceRecord;
import com.qrattendance.system.model.Teacher;
import com.qrattendance.system.repository.AttendanceRepository;
import com.qrattendance.system.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceImplTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    // ==========================================
    // TEST 1: Teacher not found
    // ==========================================
    @Test
    void recordAttendance_WhenTeacherNotFound_ThrowsException() {
        when(teacherRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            attendanceService.recordAttendance("123", "Alice", "CS", 99L);
        });

        verify(attendanceRepository, never()).save(any(AttendanceRecord.class));
    }

    // ==========================================
    // TEST 2: Duplicate scan on the same day
    // ==========================================
    @Test
    void recordAttendance_WhenDuplicateScan_ThrowsException() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(attendanceRepository.existsBySchoolIdAndDateOnly(eq("123"), any(LocalDate.class)))
                .thenReturn(true);

        assertThrows(DuplicateAttendanceException.class, () -> {
            attendanceService.recordAttendance("123", "Alice", "CS", 1L);
        });
    }

    // ==========================================
    // TEST 3: Successful attendance record
    // ==========================================
    @Test
    void recordAttendance_WhenValid_SavesRecord() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
        when(attendanceRepository.existsBySchoolIdAndDateOnly(eq("123"), any(LocalDate.class)))
                .thenReturn(false);

        attendanceService.recordAttendance("123", "Alice", "CS", 1L);

        verify(attendanceRepository, times(1)).save(any(AttendanceRecord.class));
    }

    // ==========================================
    // TEST 4: Monthly Attendance Fetch
    // ==========================================
    @Test
    void getMonthlyAttendance_ReturnsList() {
        List<AttendanceRecord> fakeList = new ArrayList<>();
        fakeList.add(new AttendanceRecord());

        when(attendanceRepository.findByTeacherIdAndDateOnlyBetween(
                eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(fakeList);

        List<AttendanceRecord> result = attendanceService.getMonthlyAttendance(1L, 10, 2026);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    // ==========================================
    // TEST 5: Clear Logs
    // ==========================================
    @Test
    void clearLogs_WhenCalled_DeletesLogsByTeacherId() {
        attendanceService.clearLogs(1L);

        verify(attendanceRepository, times(1)).deleteByTeacherId(1L);
    }
}