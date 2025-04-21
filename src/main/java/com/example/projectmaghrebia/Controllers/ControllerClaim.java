package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Claim;
import com.example.projectmaghrebia.Entities.statusClaim;
import com.example.projectmaghrebia.Repositories.ClaimRepository;
import com.example.projectmaghrebia.Services.IServiceClaim;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/claims")
public class ControllerClaim {

    @Autowired
    private IServiceClaim serviceClaim;

    @Autowired
    private ClaimRepository claimRepository;

    @PostMapping("/create")
    public ResponseEntity<Claim> createClaim(
            @RequestParam("fullName") String fullName,
            @RequestParam("claimName") String claimName,
            @RequestParam("submissionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date submissionDate,
            @RequestParam("statusClaim") statusClaim statusClaim,
            @RequestParam("claimReason") String claimReason,
            @RequestParam("description") String description,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "supportingDocuments", required = false) List<MultipartFile> files) {

        Claim claim = new Claim();
        claim.setFullName(fullName);
        claim.setClaimName(claimName);
        claim.setSubmissionDate(submissionDate);
        claim.setStatusClaim(statusClaim);
        claim.setClaimReason(claimReason);
        claim.setDescription(description);
        claim.setUserId(userId);

        // Sauvegarde des fichiers
        if (files != null && !files.isEmpty()) {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    String filePath = new File("uploads", file.getOriginalFilename()).getAbsolutePath();
                    file.transferTo(new File(filePath));
                    filePaths.add(filePath);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
            claim.setSupportingDocuments(filePaths);
        }

        Claim savedClaim = claimRepository.save(claim);
        return ResponseEntity.ok(savedClaim);
    }
    @GetMapping("/uploads/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        Path filePath = Paths.get("uploads").resolve(fileName);
        Resource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok().body(resource);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Claim> getClaimById(
            @PathVariable UUID id,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam("role") String role) {

        Claim claim = serviceClaim.getClaimById(id);
        if (claim == null) {
            return ResponseEntity.notFound().build();
        }

        // Si ce n’est pas un admin, vérifier l’appartenance de la réclamation
        if (!role.equalsIgnoreCase("ADMIN") && !claim.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(claim);
    }


    @GetMapping("/all")
    public ResponseEntity<List<Claim>> getAllClaims(@RequestParam(value = "userId", required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(claimRepository.findByUserId(userId));
        } else {
            return ResponseEntity.ok(claimRepository.findAll());
        }
    }


    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Claim> updateClaim(
            @PathVariable UUID id,
            @RequestParam("fullName") String fullName,
            @RequestParam("claimName") String claimName,
            @RequestParam("submissionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date submissionDate,
            @RequestParam("statusClaim") statusClaim statusClaim,
            @RequestParam("claimReason") String claimReason,
            @RequestParam("description") String description,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam("role") String role,
            @RequestParam(value = "supportingDocuments", required = false) List<MultipartFile> files) {

        Claim existingClaim = serviceClaim.getClaimById(id);
        if (existingClaim == null) {
            return ResponseEntity.notFound().build();
        }

        if (!role.equalsIgnoreCase("ADMIN") && !existingClaim.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        existingClaim.setFullName(fullName);
        existingClaim.setClaimName(claimName);
        existingClaim.setSubmissionDate(submissionDate);
        existingClaim.setStatusClaim(statusClaim);
        existingClaim.setClaimReason(claimReason);
        existingClaim.setDescription(description);
        existingClaim.setUserId(userId);

        if (files != null && !files.isEmpty()) {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    String filePath = new File("uploads", file.getOriginalFilename()).getAbsolutePath();
                    file.transferTo(new File(filePath));
                    filePaths.add(filePath);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
            existingClaim.setSupportingDocuments(filePaths);
        }

        Claim updatedClaim = claimRepository.save(existingClaim);
        return ResponseEntity.ok(updatedClaim);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteClaim(
            @PathVariable UUID id,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam("role") String role) {

        Claim claim = serviceClaim.getClaimById(id);
        if (claim == null) {
            return ResponseEntity.notFound().build();
        }

        // Si pas admin → vérifier l'identité de l'utilisateur
        if (!role.equalsIgnoreCase("ADMIN") && !claim.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        serviceClaim.deleteClaim(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Claim> updateClaimStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam("role") String role,
            @RequestParam(value = "userId", required = false) Long userId) {

        log.info("🔍 Mise à jour du statut de la réclamation ID: {}", id);
        log.info("🛠️ Nouveau statut reçu: {}", status);

        Claim existingClaim = claimRepository.findById(id).orElse(null);
        if (existingClaim == null) {
            return ResponseEntity.notFound().build();
        }

        // Si ce n’est pas un admin, vérifier que le userId correspond au propriétaire de la réclamation
        if (!role.equalsIgnoreCase("ADMIN") && !existingClaim.getUserId().equals(userId)) {
            log.warn("❌ Accès interdit pour l'utilisateur: {}", userId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            existingClaim.setStatusClaim(statusClaim.valueOf(status.toUpperCase()));
            return ResponseEntity.ok(claimRepository.save(existingClaim));
        } catch (IllegalArgumentException e) {
            log.error("❌ Statut invalide reçu: {}", status);
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/user/{userId}")
    public List<Claim> getClaimsByUser(@PathVariable Long userId) {
        return claimRepository.findByUserId(userId);
    }

}