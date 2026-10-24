package com.qrattendance.system.service.impl;

import com.qrattendance.system.dto.LoginRequest;
import com.qrattendance.system.dto.SignupRequest;
import com.qrattendance.system.exception.InvalidCredentialsException;
import com.qrattendance.system.exception.UserAlreadyExistsException;
import com.qrattendance.system.model.Teacher;
import com.qrattendance.system.repository.AttendanceRepository;
import com.qrattendance.system.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AttendanceRepository attendanceRepository; // Added for deleteAccount

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "expectedTeacherCode", "DEMO_SIGNUP_2026");
    }

    // ==========================================
    // TEST 1: Signup throws error if username exists
    // ==========================================
    @Test
    void signup_WhenUsernameExists_ThrowsException() {
        SignupRequest request = new SignupRequest();
        request.setUsername("existingUser");
        request.setTeacherCode("DEMO_SIGNUP_2026");

        when(teacherRepository.findByUsername("existingUser")).thenReturn(Optional.of(new Teacher()));

        assertThrows(UserAlreadyExistsException.class, () -> {
            authService.signup(request);
        });

        verify(teacherRepository, never()).save(any(Teacher.class));
    }

    // ==========================================
    // TEST 2: Signup successfully saves a teacher
    // ==========================================
    @Test
    void signup_WhenValid_SavesTeacher() {
        SignupRequest request = new SignupRequest();
        request.setName("John Doe");
        request.setUsername("newUser");
        request.setPassword("password123");
        request.setTeacherCode("DEMO_SIGNUP_2026");

        when(teacherRepository.findByUsername("newUser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");

        authService.signup(request);

        verify(teacherRepository, times(1)).save(any(Teacher.class));
    }

    // ==========================================
    // TEST 3: Login throws error if password is wrong
    // ==========================================
    @Test
    void login_WhenPasswordIsWrong_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setUsername("johndoe");
        request.setPassword("wrong_password");

        Teacher fakeTeacher = new Teacher();
        fakeTeacher.setUsername("johndoe");
        fakeTeacher.setPasswordHash("hashed_password");

        when(teacherRepository.findByUsername("johndoe")).thenReturn(Optional.of(fakeTeacher));
        when(passwordEncoder.matches("wrong_password", "hashed_password")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(request);
        });
    }

    // ==========================================
    // TEST 4: Login successfully returns a response
    // ==========================================
    @Test
    void login_WhenValid_ReturnsLoginResponse() {
        LoginRequest request = new LoginRequest();
        request.setUsername("johndoe");
        request.setPassword("correct_password");

        Teacher fakeTeacher = new Teacher();
        fakeTeacher.setId(1L);
        fakeTeacher.setName("John Doe");
        fakeTeacher.setUsername("johndoe");
        fakeTeacher.setPasswordHash("hashed_password");

        when(teacherRepository.findByUsername("johndoe")).thenReturn(Optional.of(fakeTeacher));
        when(passwordEncoder.matches("correct_password", "hashed_password")).thenReturn(true);

        var response = authService.login(request);

        assertEquals(1L, response.getId());
        assertEquals("John Doe", response.getName());
    }

    // ==========================================
    // TEST 5: Delete Account - Wrong Password
    // ==========================================
    @Test
    void deleteAccount_WhenPasswordIsWrong_ThrowsException() {
        Teacher fakeTeacher = new Teacher();
        fakeTeacher.setId(1L);
        fakeTeacher.setPasswordHash("hashed_password");

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(fakeTeacher));
        when(passwordEncoder.matches("wrong_password", "hashed_password")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.deleteAccount(1L, "wrong_password");
        });

        // Ensure nothing was deleted
        verify(attendanceRepository, never()).deleteByTeacherId(anyLong());
        verify(teacherRepository, never()).delete(any(Teacher.class));
    }

    // ==========================================
    // TEST 6: Delete Account - Success
    // ==========================================
    @Test
    void deleteAccount_WhenValid_DeletesLogsAndTeacher() {
        Teacher fakeTeacher = new Teacher();
        fakeTeacher.setId(1L);
        fakeTeacher.setPasswordHash("hashed_password");

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(fakeTeacher));
        when(passwordEncoder.matches("correct_password", "hashed_password")).thenReturn(true);

        authService.deleteAccount(1L, "correct_password");

        // Verify that logs were deleted FIRST, then the teacher
        verify(attendanceRepository, times(1)).deleteByTeacherId(1L);
        verify(teacherRepository, times(1)).delete(fakeTeacher);
    }
}