package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Services.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/certificates") // ✅ UN seul slash ici
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @PostMapping
    public ResponseEntity<String> generateCert(@RequestParam Long trainingId, @RequestParam Long userId) {
        try {
            String path = certificateService.generateCertificate(trainingId, userId);
            return ResponseEntity.ok(path);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur serveur : " + e.getMessage());
        }
    }
}
