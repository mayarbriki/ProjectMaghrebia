package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTraining_TrainingId(Long trainingId);
}

