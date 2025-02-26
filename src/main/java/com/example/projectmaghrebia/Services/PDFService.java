package com.example.projectmaghrebia.Services;



import com.example.projectmaghrebia.Entities.Contract;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PDFService {

    public byte[] generateContractPDF(Contract contract) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // ✅ Add Title
        Paragraph title = new Paragraph("Contract Agreement")
                .setBold()
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER); // ✅ Correct import
        document.add(title);

        // ✅ Add Contract Details
        document.add(new Paragraph("Contract ID: " + contract.getContract_id()));
        document.add(new Paragraph("User ID: " + contract.getUser_id()));
        document.add(new Paragraph("Contract Type: " + contract.getContract_type()));
        document.add(new Paragraph("Start Date: " + contract.getStart_date()));
        document.add(new Paragraph("End Date: " + contract.getEnd_date()));
        document.add(new Paragraph("Status: " + contract.getStatus()));
        document.add(new Paragraph("Amount: " + contract.getAmount() + " TND"));
        document.add(new Paragraph("Payment Frequency: " + contract.getPayment_type()));

        document.close();
        return out.toByteArray();  // ✅ Now correctly returns a byte array
    }
}
