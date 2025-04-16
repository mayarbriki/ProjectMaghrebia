package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Certificate;
import com.example.projectmaghrebia.Repositories.CertificateRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    public String generateCertificate(Long trainingId, Long userId) throws Exception {
        String filename = "certificate_" + userId + "_" + trainingId + ".pdf";
        String folder = "uploads/certificates/";
        String fullPath = folder + filename;

        File directory = new File(folder);
        if (!directory.exists()) directory.mkdirs();

        // ✅ Utiliser Document de iText 5
        Document doc = new Document();
        PdfWriter.getInstance(doc, new FileOutputStream(fullPath));

        doc.open();
        doc.add(new Paragraph("🎓 Certificat de Réussite"));
        doc.add(new Paragraph("Utilisateur: " + userId));
        doc.add(new Paragraph("Formation ID: " + trainingId));
        doc.add(new Paragraph("Date: " + LocalDate.now()));
        doc.close();

        // ✅ Enregistrer en BDD
        Certificate cert = new Certificate();
        cert.setTrainingId(trainingId);
        cert.setUserId(userId);
        cert.setFilePath(fullPath);
        cert.setIssuedAt(LocalDate.now());

        certificateRepository.save(cert);

        return "/files/certificates/" + filename;
    }
}
