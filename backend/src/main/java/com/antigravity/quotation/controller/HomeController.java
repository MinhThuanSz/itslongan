package com.antigravity.quotation.controller;

import com.antigravity.quotation.service.CustomerService;
import com.antigravity.quotation.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class HomeController {
    private final QuotationService quotationService;
    private final CustomerService customerService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("quotationCount", quotationService.getAll().size());
        model.addAttribute("customerCount", customerService.getAll().size());
        model.addAttribute("recentQuotations", quotationService.getAll().stream().limit(5).toList());
        return "index";
    }
}
