package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Incident;
import com.example.projectmaghrebia.Services.IIncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/incidents")
@CrossOrigin(origins = "http://localhost:4200")
public class IncidentController {

    @Autowired
    private IIncidentService incidentService;

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @GetMapping("/{id}")
    public Optional<Incident> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id);
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentService.saveIncident(incident);
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id, @RequestBody Incident incidentDetails) {
        return incidentService.updateIncident(id, incidentDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
    }
}
