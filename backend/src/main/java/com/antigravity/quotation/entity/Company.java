package com.antigravity.quotation.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "companies")
@Data
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String phone;
    private String website;
    private String email;
    private String logoPath;
    private String taxCode;
    private String stampPath;
}
