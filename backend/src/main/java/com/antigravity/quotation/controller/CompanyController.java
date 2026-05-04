package com.antigravity.quotation.controller;

import com.antigravity.quotation.entity.Company;
import com.antigravity.quotation.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @GetMapping
    public String profile(Model model) {
        model.addAttribute("company", companyService.getCompanyProfile());
        return "company/profile";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Company company) {
        companyService.save(company);
        return "redirect:/company";
    }
}
