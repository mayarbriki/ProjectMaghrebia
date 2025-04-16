package com.example.projectmaghrebia.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String description;

    private LocalDate dateOfIncident;

    private LocalDateTime submittedAt = LocalDateTime.now();

    private String locationDetails;

    private String severity;

    private String incidentCause;

    private String incidentCategory;

    private Boolean policeReportFiled = false;

    private Boolean insuranceClaimFiled = false;

    @ElementCollection
    private List<String> mediaUrls = new ArrayList<>();

    private String userEmail;

    private String userPhone;

    private Boolean faultAcknowledged = false;

    private Boolean needsAssessment = true;

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    private Double latitude;
    private Double longitude;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateOfIncident() {
        return dateOfIncident;
    }

    public void setDateOfIncident(LocalDate dateOfIncident) {
        this.dateOfIncident = dateOfIncident;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getLocationDetails() {
        return locationDetails;
    }

    public void setLocationDetails(String locationDetails) {
        this.locationDetails = locationDetails;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getIncidentCause() {
        return incidentCause;
    }

    public void setIncidentCause(String incidentCause) {
        this.incidentCause = incidentCause;
    }

    public String getIncidentCategory() {
        return incidentCategory;
    }

    public void setIncidentCategory(String incidentCategory) {
        this.incidentCategory = incidentCategory;
    }

    public Boolean getPoliceReportFiled() {
        return policeReportFiled;
    }

    public void setPoliceReportFiled(Boolean policeReportFiled) {
        this.policeReportFiled = policeReportFiled;
    }

    public Boolean getInsuranceClaimFiled() {
        return insuranceClaimFiled;
    }

    public void setInsuranceClaimFiled(Boolean insuranceClaimFiled) {
        this.insuranceClaimFiled = insuranceClaimFiled;
    }


    public String getUserEmail() {
        return userEmail;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public Boolean getFaultAcknowledged() {
        return faultAcknowledged;
    }

    public void setFaultAcknowledged(Boolean faultAcknowledged) {
        this.faultAcknowledged = faultAcknowledged;
    }

    public Boolean getNeedsAssessment() {
        return needsAssessment;
    }

    public void setNeedsAssessment(Boolean needsAssessment) {
        this.needsAssessment = needsAssessment;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    @ManyToOne
    @JoinColumn(name = "property_id")
    @JsonBackReference
    private Property property;

    public Incident() {}
}
