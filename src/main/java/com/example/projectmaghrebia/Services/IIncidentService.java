package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Incident;
import java.util.List;
import java.util.Optional;

public interface IIncidentService {
    List<Incident> getAllIncidents();
    Optional<Incident> getIncidentById(Long id);
    Incident saveIncident(Incident incident);
    Incident updateIncident(Long id, Incident incidentDetails);
    void deleteIncident(Long id);
}
