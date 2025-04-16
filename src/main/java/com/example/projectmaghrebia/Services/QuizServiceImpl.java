package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Quiz;
import com.example.projectmaghrebia.Entities.Training;
import com.example.projectmaghrebia.Repositories.QuizRepository;
import com.example.projectmaghrebia.Repositories.TrainingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements IQuizService {

    @Autowired
    private QuizRepository quizRepo;

    @Autowired
    private TrainingRepository trainingRepo;

    @Override
    public List<Quiz> getQuizzesByTrainingId(Long trainingId) {
        return quizRepo.findByTraining_TrainingId(trainingId);
    }

    @Override
    public Quiz addQuizToTraining(Long trainingId, Quiz quiz) {
        Training training = trainingRepo.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Training not found"));
        quiz.setTraining(training);
        return quizRepo.save(quiz);
    }
}
