package com.qrattendance.system.service;

import com.qrattendance.system.dto.LoginRequest;
import com.qrattendance.system.dto.LoginResponse;
import com.qrattendance.system.dto.SignupRequest;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    void signup(SignupRequest request);

    void deleteAccount(Long teacherId, String password);

}
