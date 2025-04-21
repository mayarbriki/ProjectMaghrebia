package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Assessment;
import com.example.projectmaghrebia.Entities.finalDecision;
import com.example.projectmaghrebia.Entities.statusAssessment;
import com.example.projectmaghrebia.Repositories.AssessmentRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ServiceAssessment implements IServiceAssessment {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Override
    public Assessment createAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    @Override
    public Assessment getAssessmentById(UUID id) {
        return assessmentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Assessment not found with ID: " + id)
        );
    }

    @Override
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Override
    public Assessment updateAssessment(UUID id, Assessment assessment) {
        Optional<Assessment> existingAssessment = assessmentRepository.findById(id);
        if (existingAssessment.isPresent()) {
            Assessment updatedAssessment = existingAssessment.get();
            updatedAssessment.setAssessmentDate(assessment.getAssessmentDate());
            updatedAssessment.setFindings(assessment.getFindings());
            updatedAssessment.setAssessmentDocuments(assessment.getAssessmentDocuments()); // Mise à jour des documents
            return assessmentRepository.save(updatedAssessment);
        }
        return null;
    }

    @Override
    public void deleteAssessment(UUID id) {
        assessmentRepository.deleteById(id);
    }

    @Override
    public Assessment updateStatus(UUID id, statusAssessment status) {
        Assessment assessment = assessmentRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Assessment not found with ID: " + id)
        );
        assessment.setStatusAssessment(status);
        return assessmentRepository.save(assessment);
    }

    @Override
    public Assessment updateFinalDecision(UUID id, finalDecision decision) {
        Assessment assessment = assessmentRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Assessment not found with ID: " + id)
        );
        assessment.setFinalDecision(decision);
        return assessmentRepository.save(assessment);
    }

}
