package com.qrattendance.system.controller;

import com.qrattendance.system.dto.LoginRequest;
import com.qrattendance.system.dto.LoginResponse;
import com.qrattendance.system.dto.SignupRequest;
import com.qrattendance.system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Teacher Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(@RequestParam Long teacherId, @RequestParam String password) {
        authService.deleteAccount(teacherId, password);
        return ResponseEntity.ok("Account deleted successfully.");
    }
}
