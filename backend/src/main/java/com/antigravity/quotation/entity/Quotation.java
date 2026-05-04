package com.antigravity.quotation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotations")
@Data
public class Quotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String quotationNo;

    private LocalDate createdDate;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String title;
    private String description;

    private String creatorName;
    private String creatorPhone;
    private String creatorEmail;

    private BigDecimal subTotal = BigDecimal.ZERO;
    private Integer vatRate = 10;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationTerm> terms = new ArrayList<>();
}
