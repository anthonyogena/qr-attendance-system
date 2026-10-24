package com.qrattendance.system.dto;

public class LoginResponse {

    private Long id;
    private String name;

    public LoginResponse() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
