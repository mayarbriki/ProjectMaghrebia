package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Claim;
import com.example.projectmaghrebia.Entities.statusClaim;
import com.example.projectmaghrebia.Repositories.ClaimRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
    private final JavaMailSender mailSender;

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
            statusClaim newStatus = statusClaim.valueOf(status.toUpperCase());
            existingClaim.setStatusClaim(newStatus);
            Claim updatedClaim = claimRepository.save(existingClaim);

            // Envoi de la notification si le statut est APPROVED
            if (newStatus == statusClaim.APPROVED) {
                sendClaimApprovedNotification(updatedClaim);
            }

            return updatedClaim;
        } catch (IllegalArgumentException e) {
            log.error("❌ Statut invalide reçu: {}", status);
            throw new IllegalArgumentException("Statut invalide : " + status + ". Les statuts valides sont : " +
                    List.of(statusClaim.values()));
        }
    }

    public void sendClaimApprovedNotification(Claim claim) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo("wissmhir123@gmail.com");
            helper.setSubject("✅ Your Claim Has Been Approved - Maghrebia Insurance");

            String htmlContent = """
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #ffffff; color: #333; padding: 20px; }
                        .header { background-color: #004080; color: white; padding: 15px; font-size: 20px; }
                        .content { margin-top: 20px; line-height: 1.6; }
                        .footer { margin-top: 30px; font-size: 13px; color: #555; }
                    </style>
                </head>
                <body>
                    <div class="header">Maghrebia Insurance - Claim Approved</div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        <p>We are pleased to inform you that your claim <strong>%s</strong> has been <span style="color:green;"><strong>APPROVED</strong></span>.</p>
                        <p>An assessment will be scheduled shortly and a final decision will be communicated in due time.</p>
                        <p>You can log in to your account to follow up on the next steps.</p>
                        <p>Best regards,</p>
                        <p><strong>Maghrebia Insurance</strong></p>
                    </div>
                    <div class="footer">
                        64, rue de Palestine, 1002 / 24, Rue du Royaume d'Arabie Saoudite, Tunis<br>
                        Phone: 00 216 71 788 800 | Fax: 00 216 71 788 334<br>
                        Email: relation.client@maghrebia.com.tn<br><br>
                        Thank you for trusting Maghrebia Insurance.<br>
                        We remain at your disposal for any further information.
                    </div>
                </body>
                </html>
                """.formatted(claim.getFullName(), claim.getClaimName());

            helper.setText(htmlContent, true);
            mailSender.send(message);

            log.info("✅ Notification email sent for APPROVED claim ID {}", claim.getIdClaim());
        } catch (Exception e) {
            log.error("❌ Failed to send claim approved email: {}", e.getMessage());
        }
    }
}