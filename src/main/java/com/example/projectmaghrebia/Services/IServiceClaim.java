package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Claim;
import java.util.List;
import java.util.UUID;

public interface IServiceClaim {
    Claim createClaim(Claim claim);
    Claim getClaimById(UUID id);
    List<Claim> getAllClaims();
    Claim updateClaim(UUID id, Claim claim);
    void deleteClaim(UUID id);
    Claim updateClaimStatus(UUID id, String status);
    void sendClaimApprovedNotification(Claim claim) ;

}