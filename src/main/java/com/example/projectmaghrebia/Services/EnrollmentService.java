package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Enrollment;
import com.example.projectmaghrebia.Repositories.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    // ✅ Enregistrer une inscription
    public void inscrire(Enrollment enrollment) {
        System.out.println("🎯 Enregistrement en base : " + enrollment);
        enrollmentRepo.save(enrollment);
    }

    // ✅ Vérifier si l'utilisateur est déjà inscrit à une formation
    public boolean isUserEnrolled(Long userId, Long trainingId) {
        return enrollmentRepo.existsByUserIdAndTrainingId(userId, trainingId);
    }
}
