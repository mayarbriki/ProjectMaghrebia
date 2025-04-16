package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Quiz;

import java.util.List;

public interface IQuizService {
    List<Quiz> getQuizzesByTrainingId(Long trainingId);
    Quiz addQuizToTraining(Long trainingId, Quiz quiz);
}
