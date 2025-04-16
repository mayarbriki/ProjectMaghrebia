package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Training;

import java.util.List;
import java.util.Optional;

public interface ITrainingService {
    List<Training> getAllTrainings();
    Optional<Training> getTrainingById(Long id);
    Training createTraining(Training training);
    Training updateTraining(Long id, Training training);
    void deleteTraining(Long id);
}
