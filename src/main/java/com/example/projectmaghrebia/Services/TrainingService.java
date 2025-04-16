package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Training;
import com.example.projectmaghrebia.Repositories.TrainingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TrainingService implements ITrainingService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Override
    public List<Training> getAllTrainings() {
        return trainingRepository.findAll();
    }

    @Override
    public Optional<Training> getTrainingById(Long id) {
        return trainingRepository.findById(id);
    }

    @Override
    public Training createTraining(Training training) {
        // Auto-assign creation timestamp
        training.setCreatedAt(LocalDateTime.now());

        // Optional: Set createdBy if user is authenticated
        // training.setCreatedBy(authenticatedUser);

        return trainingRepository.save(training);
    }

    @Override
    @Transactional

    public Training updateTraining(Long id, Training newTraining) {
        Training existing = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        existing.setTitle(newTraining.getTitle());
        existing.setDescription(newTraining.getDescription());
        existing.setStartDate(newTraining.getStartDate());
        existing.setEndDate(newTraining.getEndDate());
        existing.setLocation(newTraining.getLocation());
        existing.setMode(newTraining.getMode());
        existing.setImageUrl(newTraining.getImageUrl()); // ← OK ✅

        // ❌ PROBLÈME : cette ligne manque !
        existing.setCoursePdfUrl(newTraining.getCoursePdfUrl()); // ← 🛠 AJOUTE-LA !

        return trainingRepository.save(existing);
    }


    @Override
    public void deleteTraining(Long id) {
        trainingRepository.deleteById(id);
    }
}
