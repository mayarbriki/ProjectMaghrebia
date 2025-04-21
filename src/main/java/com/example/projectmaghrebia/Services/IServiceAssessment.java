package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Assessment;
import com.example.projectmaghrebia.Entities.finalDecision;
import com.example.projectmaghrebia.Entities.statusAssessment;

import java.util.List;
import java.util.UUID;

public interface IServiceAssessment {
    Assessment createAssessment(Assessment assessment);
    Assessment getAssessmentById(UUID id);
    List<Assessment> getAllAssessments();
    Assessment updateAssessment(UUID id, Assessment assessment);
    void deleteAssessment(UUID id);
    Assessment updateStatus(UUID id, statusAssessment status);
    Assessment updateFinalDecision(UUID id, finalDecision decision);

}