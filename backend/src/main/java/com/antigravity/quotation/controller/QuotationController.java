package com.antigravity.quotation.controller;

import com.antigravity.quotation.entity.Quotation;
import com.antigravity.quotation.entity.QuotationItem;
import com.antigravity.quotation.service.CustomerService;
import com.antigravity.quotation.service.ExportService;
import com.antigravity.quotation.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;

@Controller
@RequestMapping("/quotations")
@RequiredArgsConstructor
public class QuotationController {
    private final QuotationService quotationService;
    private final CustomerService customerService;
    private final ExportService exportService;

    @GetMapping
    public String list(Model model, @RequestParam(required = false) String keyword) {
        model.addAttribute("quotations", quotationService.search(keyword));
        model.addAttribute("keyword", keyword);
        return "quotation/list";
    }

    @GetMapping("/create")
    public String createForm(Model model) {
        Quotation quotation = new Quotation();
        quotation.setCreatedDate(LocalDate.now());
        quotation.setItems(new ArrayList<>());
        quotation.setTerms(new ArrayList<>());
        
        // Add one empty item by default
        quotation.getItems().add(new QuotationItem());
        
        model.addAttribute("quotation", quotation);
        model.addAttribute("customers", customerService.getAll());
        return "quotation/form";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        Quotation quotation = quotationService.getById(id);
        model.addAttribute("quotation", quotation);
        model.addAttribute("customers", customerService.getAll());
        return "quotation/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Quotation quotation) {
        quotationService.save(quotation);
        return "redirect:/quotations";
    }

    @GetMapping("/view/{id}")
    public String view(@PathVariable Long id, Model model) {
        model.addAttribute("quotation", quotationService.getById(id));
        return "quotation/view";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        quotationService.delete(id);
        return "redirect:/quotations";
    }

    @GetMapping("/export/pdf/{id}")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id) throws IOException {
        Quotation quotation = quotationService.getById(id);
        byte[] pdfBytes = exportService.generatePdf(quotation);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quotation_" + quotation.getQuotationNo() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/export/excel/{id}")
    public ResponseEntity<byte[]> exportExcel(@PathVariable Long id) throws IOException {
        Quotation quotation = quotationService.getById(id);
        byte[] excelBytes = exportService.generateExcel(quotation);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quotation_" + quotation.getQuotationNo() + ".xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }
}
