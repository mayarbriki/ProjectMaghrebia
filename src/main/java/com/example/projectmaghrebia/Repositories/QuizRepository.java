package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByTraining_TrainingId(Long trainingId);
}
