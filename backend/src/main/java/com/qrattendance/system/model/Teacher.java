package com.qrattendance.system.model;

import jakarta.persistence.*;

@Entity(name = "Teacher")
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (
            name = "name",
            nullable = false
    )
    private String name;

    @Column (
            name = "username",
            nullable = false,
            unique = true
    )
    private String username;

    @Column (
            name = "passwordHash",
            nullable = false
    )
    private String passwordHash;

    public Teacher() {

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }




}
