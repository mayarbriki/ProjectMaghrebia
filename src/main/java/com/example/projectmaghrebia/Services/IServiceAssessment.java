package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Assessment;
import java.util.List;
import java.util.UUID;

public interface IServiceAssessment {
    Assessment createAssessment(Assessment assessment);
    Assessment getAssessmentById(UUID id);
    List<Assessment> getAllAssessments();
    Assessment updateAssessment(UUID id, Assessment assessment);
    void deleteAssessment(UUID id);
}