package com.qrattendance.system.repository;

import com.qrattendance.system.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    @Transactional
    void deleteByTeacherId(Long teacherId);

    boolean existsBySchoolIdAndDateOnly(String schoolId, LocalDate date);

    List<AttendanceRecord> findByTeacherIdAndDateOnlyBetween(Long teacherId, LocalDate startDate, LocalDate endDate);

}
