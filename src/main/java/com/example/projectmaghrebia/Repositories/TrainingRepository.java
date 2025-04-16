package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
}
