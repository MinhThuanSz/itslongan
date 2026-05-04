package com.antigravity.quotation.service;

import com.antigravity.quotation.entity.Quotation;
import com.antigravity.quotation.entity.QuotationItem;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ExportService {
    private final TemplateEngine templateEngine;

    public byte[] generatePdf(Quotation quotation) throws IOException {
        Context context = new Context();
        context.setVariable("quotation", quotation);
        String html = templateEngine.process("quotation/pdf_template", context);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        }
    }

    public byte[] generateExcel(Quotation quotation) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Quotation");

            // Basic Header Info
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Quotation No:");
            headerRow.createCell(1).setCellValue(quotation.getQuotationNo());

            Row customerRow = sheet.createRow(1);
            customerRow.createCell(0).setCellValue("Customer:");
            customerRow.createCell(1).setCellValue(quotation.getCustomer().getName());

            // Table Header
            Row tableHeader = sheet.createRow(4);
            String[] columns = {"STT", "Nội dung", "ĐVT", "Số lượng", "Đơn giá", "Thành tiền"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = tableHeader.createCell(i);
                cell.setCellValue(columns[i]);
            }

            // Table Data
            int rowIdx = 5;
            for (QuotationItem item : quotation.getItems()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.getStt());
                row.createCell(1).setCellValue(item.getContent());
                row.createCell(2).setCellValue(item.getUnit());
                row.createCell(3).setCellValue(item.getQuantity() != null ? item.getQuantity() : 0);
                row.createCell(4).setCellValue(item.getUnitPrice().doubleValue());
                row.createCell(5).setCellValue(item.getTotalPrice().doubleValue());
            }

            // Totals
            Row totalRow = sheet.createRow(rowIdx + 1);
            totalRow.createCell(4).setCellValue("Total Before VAT:");
            totalRow.createCell(5).setCellValue(quotation.getSubTotal().doubleValue());

            workbook.write(os);
            return os.toByteArray();
        }
    }
}
