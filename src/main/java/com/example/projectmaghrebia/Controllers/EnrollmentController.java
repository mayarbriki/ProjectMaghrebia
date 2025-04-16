package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Enrollment;
import com.example.projectmaghrebia.Services.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // ✅ Inscription via @RequestBody (ex: formulaire complet)
    @PostMapping
    public ResponseEntity<String> inscrire(@RequestBody Enrollment enrollment) {
        enrollmentService.inscrire(enrollment);
        return ResponseEntity.ok("✅ Inscription enregistrée !");
    }

    // ✅ Inscription via userId & trainingId (ex: depuis Angular bouton)
    @PostMapping(params = { "userId", "trainingId" })
    public ResponseEntity<String> inscrireAvecIds(@RequestParam Long userId, @RequestParam Long trainingId) {
        if (!enrollmentService.isUserEnrolled(userId, trainingId)) {
            Enrollment enrollment = new Enrollment();
            enrollment.setUserId(userId);
            enrollment.setTrainingId(trainingId);
            enrollment.setEnrolledAt(LocalDate.now());

            enrollmentService.inscrire(enrollment);
        }
        return ResponseEntity.ok("✅ Inscription enregistrée !");
    }

    // ✅ Vérifier si un utilisateur est déjà inscrit (GET /check)
    @GetMapping("/check")
    public ResponseEntity<Boolean> isEnrolled(@RequestParam Long userId, @RequestParam Long trainingId) {
        boolean enrolled = enrollmentService.isUserEnrolled(userId, trainingId);
        return ResponseEntity.ok(enrolled);
    }
}
