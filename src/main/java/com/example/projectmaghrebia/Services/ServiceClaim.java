package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Claim;
import com.example.projectmaghrebia.Entities.statusClaim;
import com.example.projectmaghrebia.Repositories.ClaimRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ServiceClaim implements IServiceClaim {

    @Autowired
    private ClaimRepository claimRepository;

    @Override
    public Claim createClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    @Override
    public Claim getClaimById(UUID id) {  // UUID au lieu de String
        return claimRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Claim not found with ID: " + id)
        );
    }

    @Override
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    @Override
    public Claim updateClaim(UUID id, Claim claim) {
        Optional<Claim> existingClaim = claimRepository.findById(id);
        if (existingClaim.isPresent()) {
            Claim updatedClaim = existingClaim.get();
            // Update the fields from the provided claim object
            updatedClaim.setFullName(claim.getFullName());
            updatedClaim.setClaimName(claim.getClaimName());
            updatedClaim.setSubmissionDate(claim.getSubmissionDate());
            updatedClaim.setStatusClaim(claim.getStatusClaim());
            updatedClaim.setClaimReason(claim.getClaimReason());
            updatedClaim.setDescription(claim.getDescription());
            updatedClaim.setSupportingDocuments(claim.getSupportingDocuments());
            return claimRepository.save(updatedClaim);
        }
        return null; // Return null if the claim does not exist
    }

    @Override
    public void deleteClaim(UUID id) {
        claimRepository.deleteById(id); // Convert String to UUID
    }

    @Override
    public Claim updateClaimStatus(UUID id, String status) {
        log.info("🔍 Mise à jour du statut de la réclamation ID: {}", id);
        log.info("🛠️ Nouveau statut reçu: {}", status);

        Claim existingClaim = claimRepository.findById(id).orElseThrow(() -> {
            log.error("❌ Aucune réclamation trouvée avec l'ID: {}", id);
            return new NoSuchElementException("Aucune réclamation trouvée avec l'ID : " + id);
        });

        try {
            existingClaim.setStatusClaim(statusClaim.valueOf(status.toUpperCase()));
            return claimRepository.save(existingClaim);
        } catch (IllegalArgumentException e) {
            log.error("❌ Statut invalide reçu: {}", status);
            throw new IllegalArgumentException("Statut invalide : " + status + ". Les statuts valides sont : " +
                    List.of(statusClaim.values()));
        }
    }


}