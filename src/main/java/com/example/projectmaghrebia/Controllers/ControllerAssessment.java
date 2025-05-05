package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Assessment;
import com.example.projectmaghrebia.Entities.Claim;
import com.example.projectmaghrebia.Entities.finalDecision;
import com.example.projectmaghrebia.Entities.statusAssessment;
import com.example.projectmaghrebia.Repositories.AssessmentRepository;
import com.example.projectmaghrebia.Repositories.ClaimRepository;
import com.example.projectmaghrebia.Services.IServiceAssessment;
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
import java.util.*;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/assessments")
public class ControllerAssessment {
    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private IServiceAssessment serviceAssessment;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @PostMapping("/create")
    public ResponseEntity<Assessment> createAssessment(
            @RequestParam("assessmentDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date assessmentDate,
            @RequestParam("submissionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date submissionDate,
            @RequestParam("findings") String findings,
            @RequestParam("statusAssessment") statusAssessment statusAssessment,
            @RequestParam("finalDecision") finalDecision finalDecision,
            @RequestParam(value = "assessmentDocuments", required = false) List<MultipartFile> files,
            @RequestParam(value = "claimId", required = false) UUID claimId) {

        Assessment assessment = new Assessment();
        assessment.setAssessmentDate(assessmentDate);
        assessment.setSubmissionDate(submissionDate);
        assessment.setFindings(findings);
        assessment.setStatusAssessment(statusAssessment);
        assessment.setFinalDecision(finalDecision);

        if (claimId != null) {
            Claim claim = claimRepository.findById(claimId).orElse(null);
            if (claim != null) {
                assessment.setClaim(claim);
            }
        }

        // Sauvegarde des fichiers (assessments documents)
        if (files != null && !files.isEmpty()) {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    String filePath = new File("uploads_Assessments", file.getOriginalFilename()).getAbsolutePath();
                    file.transferTo(new File(filePath));
                    filePaths.add(filePath);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
            assessment.setAssessmentDocuments(filePaths);  // Ajout des fichiers à assessmentDocuments
        }

        Assessment savedAssessment = assessmentRepository.save(assessment);
        return ResponseEntity.ok(savedAssessment);
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<Assessment> getAssessmentById(@PathVariable UUID id) {
        Assessment assessment = serviceAssessment.getAssessmentById(id);
        if (assessment != null) {
            return ResponseEntity.ok(assessment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public List<Assessment> getAllAssessments() {
        return serviceAssessment.getAllAssessments();
    }

    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Assessment> updateAssessment(
            @PathVariable UUID id,
            @RequestParam("assessmentDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date assessmentDate,
            @RequestParam("submissionDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date submissionDate,
            @RequestParam("findings") String findings,
            @RequestParam("statusAssessment") statusAssessment statusAssessment,
            @RequestParam("finalDecision") finalDecision finalDecision,
            @RequestParam(value = "assessmentDocuments", required = false) List<MultipartFile> files,
            @RequestParam(value = "claimId", required = false) UUID claimId) {

        Assessment existingAssessment = serviceAssessment.getAssessmentById(id);
        if (existingAssessment == null) {
            return ResponseEntity.notFound().build();
        }

        existingAssessment.setAssessmentDate(assessmentDate);
        existingAssessment.setSubmissionDate(submissionDate);
        existingAssessment.setFindings(findings);
        existingAssessment.setStatusAssessment(statusAssessment);
        existingAssessment.setFinalDecision(finalDecision);

        if (claimId != null) {
            Claim claim = claimRepository.findById(claimId).orElse(null);
            if (claim != null) {
                existingAssessment.setClaim(claim);
            }
        }

        // Sauvegarde des fichiers (assessments documents)
        if (files != null && !files.isEmpty()) {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    String filePath = new File("uploads_Assessments", file.getOriginalFilename()).getAbsolutePath();
                    file.transferTo(new File(filePath));
                    filePaths.add(filePath);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
            existingAssessment.setAssessmentDocuments(filePaths);  // Mise à jour des fichiers
        }

        Assessment updatedAssessment = assessmentRepository.save(existingAssessment);
        return ResponseEntity.ok(updatedAssessment);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable UUID id, @RequestParam("userId") Long userId, @RequestParam("role") String role) {
        // Récupérer l'Assessment à supprimer
        Assessment assessment = assessmentRepository.findById(id).orElse(null);

        if (assessment == null) {
            return ResponseEntity.notFound().build();  // Si l'évaluation n'existe pas
        }

        // Vérifier si l'utilisateur est le propriétaire ou un administrateur
        if (!role.equals("ADMIN") && !role.equals("AGENT")) {
            // Si l'utilisateur n'est pas ADMIN/AGENT, vérifier s'il est le propriétaire du claim associé
            if (!assessment.getClaim().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();  // L'utilisateur n'est pas autorisé
            }
        }

        // Si l'utilisateur est autorisé, procéder à la suppression
        serviceAssessment.deleteAssessment(id); // Suppression via votre service
        return ResponseEntity.noContent().build();  // Retourner une réponse sans contenu pour indiquer succès
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Assessment> updateStatusAssessment(
            @PathVariable UUID id,
            @RequestParam("status") String status) {

        Assessment assessment = assessmentRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Assessment not found with ID: " + id)
        );

        try {
            assessment.setStatusAssessment(statusAssessment.valueOf(status.toUpperCase()));
            Assessment updated = assessmentRepository.save(assessment);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // statut invalide
        }
    }

    @PutMapping("/{id}/final-decision")
    public ResponseEntity<Assessment> updateFinalDecision(
            @PathVariable UUID id,
            @RequestParam("decision") String decision) {

        try {
            finalDecision parsedDecision = finalDecision.valueOf(decision.toUpperCase());
            Assessment updatedAssessment = serviceAssessment.updateFinalDecision(id, parsedDecision); // ✅ call service
            return ResponseEntity.ok(updatedAssessment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Invalid decision
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/assessmentByUser")
    public List<Assessment> getMyAssessments(@RequestParam("userId") Long userId, @RequestParam("role") String role) {
        if (role.equals("ADMIN") || role.equals("AGENT")) {
            return assessmentRepository.findAll(); // admin ou agent → tout voir
        } else {
            return assessmentRepository.findByClaimUserId(userId); // user → seulement ses assessments
        }
    }


}
