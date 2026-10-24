package com.qrattendance.system.service.impl;

import com.qrattendance.system.dto.LoginRequest;
import com.qrattendance.system.dto.LoginResponse;
import com.qrattendance.system.dto.SignupRequest;
import com.qrattendance.system.exception.EntityNotFoundException;
import com.qrattendance.system.exception.InvalidCredentialsException;
import com.qrattendance.system.exception.InvalidTeacherCodeException;
import com.qrattendance.system.exception.UserAlreadyExistsException;
import com.qrattendance.system.model.Teacher;
import com.qrattendance.system.repository.AttendanceRepository;
import com.qrattendance.system.repository.TeacherRepository;
import com.qrattendance.system.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceRepository attendanceRepository;

    @Value("${app.signup.teacher-code}")
    private String expectedTeacherCode;


    public AuthServiceImpl(TeacherRepository teacherRepository, PasswordEncoder passwordEncoder, AttendanceRepository attendanceRepository) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public void signup(SignupRequest request) {

        if (!expectedTeacherCode.equals(request.getTeacherCode())) {
            throw new InvalidTeacherCodeException("Invalid Teacher Registration Code!");
        }

        if (teacherRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username is already taken!");
        }

        Teacher teacher = new Teacher();
        teacher.setName(request.getName());
        teacher.setUsername(request.getUsername());
        teacher.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request){

        Teacher teacher = teacherRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), teacher.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid Password");
        }
        LoginResponse response = new LoginResponse();
        response.setId(teacher.getId());
        response.setName(teacher.getName());

        return response;
    }

    @Override
    @Transactional
    public void deleteAccount(Long teacherId, String password) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        if (!passwordEncoder.matches(password, teacher.getPasswordHash())) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        // 1. Delete their attendance logs first
        attendanceRepository.deleteByTeacherId(teacherId);

        // 2. Delete the teacher
        teacherRepository.delete(teacher);
    }

}
