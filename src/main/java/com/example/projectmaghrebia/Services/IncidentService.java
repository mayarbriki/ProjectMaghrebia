package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Incident;
import com.example.projectmaghrebia.Repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    public List<Incident> getAll() {
        return incidentRepository.findAll();
    }

    public Incident getById(Long id) {
        return incidentRepository.findById(id).orElse(null);
    }

    public List<Incident> getByPropertyId(Long propertyId) {
        return incidentRepository.findByPropertyId(propertyId);
    }

    public Incident save(Incident incident) {
        return incidentRepository.save(incident);
    }

    public void delete(Long id) {
        incidentRepository.deleteById(id);
    }
}
