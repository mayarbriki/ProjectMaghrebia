package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Claim;
import com.example.projectmaghrebia.Entities.statusClaim;
import com.example.projectmaghrebia.Repositories.ClaimRepository;
import com.example.projectmaghrebia.Services.IServiceClaim;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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
            @RequestParam(value = "supportingDocuments", required = false) List<MultipartFile> files) {

        Claim claim = new Claim();
        claim.setFullName(fullName);
        claim.setClaimName(claimName);
        claim.setSubmissionDate(submissionDate);
        claim.setStatusClaim(statusClaim);
        claim.setClaimReason(claimReason);
        claim.setDescription(description);

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

    @GetMapping("/get/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable UUID id) {
        Claim claim = serviceClaim.getClaimById(id);
        if (claim != null) {
            return ResponseEntity.ok(claim);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public List<Claim> getAllClaims() {
        return serviceClaim.getAllClaims();
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
            @RequestParam(value = "supportingDocuments", required = false) List<MultipartFile> files) {

        // Vérifier si le claim existe
        Claim existingClaim = serviceClaim.getClaimById(id);
        if (existingClaim == null) {
            return ResponseEntity.notFound().build();
        }

        // Mise à jour des champs
        existingClaim.setFullName(fullName);
        existingClaim.setClaimName(claimName);
        existingClaim.setSubmissionDate(submissionDate);
        existingClaim.setStatusClaim(statusClaim);
        existingClaim.setClaimReason(claimReason);
        existingClaim.setDescription(description);

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
            existingClaim.setSupportingDocuments(filePaths);
        }

        // Sauvegarde de la mise à jour
        Claim updatedClaim = claimRepository.save(existingClaim);
        return ResponseEntity.ok(updatedClaim);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable UUID id) {
        serviceClaim.deleteClaim(id);
        return ResponseEntity.noContent().build();
    }
}