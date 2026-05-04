package com.antigravity.quotation.service;

import com.antigravity.quotation.entity.Company;
import com.antigravity.quotation.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    public Company getCompanyProfile() {
        return companyRepository.findAll().stream().findFirst().orElse(new Company());
    }

    public void save(Company company) {
        companyRepository.save(company);
    }
}
