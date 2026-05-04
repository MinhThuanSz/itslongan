package com.antigravity.quotation.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "quotation_terms")
@Data
public class QuotationTerm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quotation_id")
    private Quotation quotation;

    @Column(columnDefinition = "TEXT")
    private String termContent;
}
