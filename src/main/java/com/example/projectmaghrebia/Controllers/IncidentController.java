package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Incident;
import com.example.projectmaghrebia.Services.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAll();
    }

    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {
        return incidentService.getById(id);
    }

    @GetMapping("/property/{propertyId}")
    public List<Incident> getIncidentsByProperty(@PathVariable Long propertyId) {
        return incidentService.getByPropertyId(propertyId);
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentService.save(incident);
    }

    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable Long id, @RequestBody Incident updatedIncident) {
        Incident existing = incidentService.getById(id);
        if (existing == null) return null;

        existing.setTitle(updatedIncident.getTitle());
        existing.setDescription(updatedIncident.getDescription());
        existing.setDateOfIncident(updatedIncident.getDateOfIncident());
        existing.setLocationDetails(updatedIncident.getLocationDetails());
        existing.setSeverity(updatedIncident.getSeverity());
        existing.setIncidentCause(updatedIncident.getIncidentCause());
        existing.setIncidentCategory(updatedIncident.getIncidentCategory());
        existing.setPoliceReportFiled(updatedIncident.getPoliceReportFiled());
        existing.setInsuranceClaimFiled(updatedIncident.getInsuranceClaimFiled());

        // ✅ Correct way to update media URLs
        existing.setMediaUrls(updatedIncident.getMediaUrls());

        existing.setUserEmail(updatedIncident.getUserEmail());
        existing.setUserPhone(updatedIncident.getUserPhone());
        existing.setFaultAcknowledged(updatedIncident.getFaultAcknowledged());
        existing.setNeedsAssessment(updatedIncident.getNeedsAssessment());

        return incidentService.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable Long id) {
        incidentService.delete(id);
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Incident createIncident(
            @RequestPart("incident") Incident incident,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws IOException {
        List<String> uploadedUrls = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path path = Paths.get("uploads/" + filename);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                uploadedUrls.add("/uploads/" + filename);
            }
        }

        incident.setMediaUrls(uploadedUrls);
        return incidentService.save(incident);
    }

}
