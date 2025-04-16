package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserIdAndTrainingId(Long userId, Long trainingId);
}

