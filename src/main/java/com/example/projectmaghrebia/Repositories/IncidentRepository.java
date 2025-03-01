package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
}
