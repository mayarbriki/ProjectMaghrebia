package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByPropertyId(Long propertyId);
}
