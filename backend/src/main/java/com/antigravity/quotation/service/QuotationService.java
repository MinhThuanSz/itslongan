package com.antigravity.quotation.service;

import com.antigravity.quotation.entity.Quotation;
import com.antigravity.quotation.entity.QuotationItem;
import com.antigravity.quotation.entity.QuotationTerm;
import com.antigravity.quotation.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuotationService {
    private final QuotationRepository quotationRepository;

    public List<Quotation> getAll() {
        return quotationRepository.findAll();
    }

    public List<Quotation> search(String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            return quotationRepository.search(keyword);
        }
        return getAll();
    }

    public Quotation getById(Long id) {
        return quotationRepository.findById(id).orElse(null);
    }

    @Transactional
    public Quotation save(Quotation quotation) {
        // Calculate totals
        BigDecimal subTotal = BigDecimal.ZERO;
        for (QuotationItem item : quotation.getItems()) {
            item.setQuotation(quotation);
            if (item.getQuantity() != null && item.getUnitPrice() != null) {
                BigDecimal totalItem = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
                item.setTotalPrice(totalItem);
                subTotal = subTotal.add(totalItem);
            }
        }

        quotation.setSubTotal(subTotal);
        BigDecimal taxAmount = subTotal.multiply(new BigDecimal(quotation.getVatRate())).divide(new BigDecimal(100));
        quotation.setTaxAmount(taxAmount);
        quotation.setTotalAmount(subTotal.add(taxAmount));

        if (quotation.getTerms() != null) {
            for (QuotationTerm term : quotation.getTerms()) {
                term.setQuotation(quotation);
            }
        }

        return quotationRepository.save(quotation);
    }

    public void delete(Long id) {
        quotationRepository.deleteById(id);
    }
}
