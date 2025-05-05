package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Assessment;
import com.example.projectmaghrebia.Entities.Claim;
import com.example.projectmaghrebia.Entities.finalDecision;
import com.example.projectmaghrebia.Entities.statusAssessment;
import com.example.projectmaghrebia.Repositories.AssessmentRepository;
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
public class ServiceAssessment implements IServiceAssessment {

    @Autowired
    private AssessmentRepository assessmentRepository;
    private final JavaMailSender mailSender;

    @Override
    public Assessment createAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    @Override
    public Assessment getAssessmentById(UUID id) {
        return assessmentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Assessment not found with ID: " + id)
        );
    }

    @Override
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Override
    public Assessment updateAssessment(UUID id, Assessment assessment) {
        Optional<Assessment> existingAssessment = assessmentRepository.findById(id);
        if (existingAssessment.isPresent()) {
            Assessment updatedAssessment = existingAssessment.get();
            updatedAssessment.setAssessmentDate(assessment.getAssessmentDate());
            updatedAssessment.setFindings(assessment.getFindings());
            updatedAssessment.setAssessmentDocuments(assessment.getAssessmentDocuments()); // Mise à jour des documents
            return assessmentRepository.save(updatedAssessment);
        }
        return null;
    }

    @Override
    public void deleteAssessment(UUID id) {
        assessmentRepository.deleteById(id);
    }

    @Override
    public Assessment updateStatus(UUID id, statusAssessment status) {
        Assessment assessment = assessmentRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Assessment not found with ID: " + id)
        );
        assessment.setStatusAssessment(status);
        Assessment saved = assessmentRepository.save(assessment);

        sendAssessmentNotification(saved);
        return saved;
    }

    @Override
    public Assessment updateFinalDecision(UUID id, finalDecision decision) {
        Assessment assessment = assessmentRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Assessment not found with ID: " + id)
        );
        assessment.setFinalDecision(decision);
        Assessment saved = assessmentRepository.save(assessment);

        sendAssessmentNotification(saved);
        return saved;
    }

    private void sendAssessmentNotification(Assessment assessment) {
        try {
            Claim claim = assessment.getClaim();

            String subject = "Final Assessment Decision – Maghrebia Insurance";

            String htmlContent = String.format("""
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #ffffff;
                            padding: 30px;
                            color: #333333;
                        }
                        .container {
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            padding: 20px;
                            max-width: 600px;
                            margin: auto;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        h2 {
                            color: #004080;
                        }
                        .info {
                            margin-top: 20px;
                            font-size: 15px;
                        }
                        .footer {
                            margin-top: 40px;
                            font-size: 13px;
                            color: #666;
                            border-top: 1px solid #ddd;
                            padding-top: 15px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Final Decision of Your Claim Assessment</h2>

                        <p>Dear Client,</p>

                        <p>We would like to inform you that a <strong>final decision</strong> has been made regarding the assessment of your claim:</p>

                        <div class="info">
                            <p><strong>Claim:</strong> %s</p>
                            <p><strong>Assessment ID:</strong> %s</p>
                            <p><strong>Assessment Date:</strong> %s</p>
                            <p><strong>Final Decision:</strong> <span style="color:#004080;">%s</span></p>
                        </div>

                        <p>We invite you to log in to your client space to view all related details.</p>

                        <p>Thank you for trusting <strong>Maghrebia Insurance</strong>.</p>

                        <div class="footer">
                            <p>We remain at your disposal for any further information.</p>
                            <p><strong>Maghrebia Insurance</strong></p>
                            <p>64, rue de Palestine, 1002 / 24, Rue du Royaume d'Arabie Saoudite, Tunis</p>
                            <p>Phone: 00 216 71 788 800 | Fax: 00 216 71 788 334</p>
                            <p>Email: relation.client@maghrebia.com.tn</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                    claim != null ? claim.getClaimName() : "Unknown Claim",
                    assessment.getIdAssessment(),
                    assessment.getAssessmentDate(),
                    assessment.getFinalDecision()
            );

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo("wissmhir123@gmail.com");
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
            log.info("Professional email sent to wissmhir123@gmail.com");

        } catch (Exception e) {
            log.error("Error sending email: {}", e.getMessage());
            e.printStackTrace();
        }
    }

}
