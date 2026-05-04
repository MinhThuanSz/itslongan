package com.antigravity.quotation.repository;

import com.antigravity.quotation.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    @Query("SELECT q FROM Quotation q WHERE q.quotationNo LIKE %:keyword% OR q.customer.name LIKE %:keyword% OR q.title LIKE %:keyword%")
    List<Quotation> search(@Param("keyword") String keyword);
}
