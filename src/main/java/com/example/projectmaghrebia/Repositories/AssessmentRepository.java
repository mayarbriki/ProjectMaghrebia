package com.example.projectmaghrebia.Repositories;


import com.example.projectmaghrebia.Entities.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
    public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {
    List<Assessment> findByClaimUserId(Long userId);

}