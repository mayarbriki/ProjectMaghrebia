package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Rating;
import com.example.projectmaghrebia.Entities.Training;
import com.example.projectmaghrebia.Repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepo;

    @PostMapping("/training/{trainingId}")
    public ResponseEntity<?> rateTraining(@PathVariable Long trainingId, @RequestBody Rating rating) {
        Training training = new Training();
        training.setTrainingId(trainingId);
        rating.setTraining(training);
        Rating saved = ratingRepo.save(rating);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/training/{trainingId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long trainingId) {
        List<Rating> ratings = ratingRepo.findByTraining_TrainingId(trainingId);
        double average = ratings.stream()
                .mapToInt(Rating::getValue)
                .average()
                .orElse(0.0);
        return ResponseEntity.ok(average);
    }
}

