package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Quiz;
import com.example.projectmaghrebia.Entities.Training;
import com.example.projectmaghrebia.Repositories.QuizRepository;
import com.example.projectmaghrebia.Repositories.TrainingRepository;
import com.example.projectmaghrebia.Services.QuizServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepo;

    @Autowired
    private TrainingRepository trainingRepo;

    @PostMapping("/training/{trainingId}")
    public ResponseEntity<Quiz> addQuizToTraining(@PathVariable Long trainingId, @RequestBody Quiz quiz) {
        Training training = trainingRepo.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        quiz.setTraining(training); // ✅ associe à la formation
        Quiz saved = quizRepo.save(quiz);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/training/{trainingId}")
    public List<Quiz> getQuizzesByTraining(@PathVariable Long trainingId) {
        return quizRepo.findByTraining_TrainingId(trainingId);
    }
}
