package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Incident;
import com.example.projectmaghrebia.Repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentServiceImpl implements IIncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Override
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @Override
    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }

    @Override
    public Incident saveIncident(Incident incident) {
        return incidentRepository.save(incident);
    }

    @Override
    public Incident updateIncident(Long id, Incident incidentDetails) {
        return incidentRepository.findById(id).map(incident -> {
            incident.setDescription(incidentDetails.getDescription());
            incident.setDate(incidentDetails.getDate());
            return incidentRepository.save(incident);
        }).orElseThrow(() -> new RuntimeException("Incident not found"));
    }

    @Override
    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
