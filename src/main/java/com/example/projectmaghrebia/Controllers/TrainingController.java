package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Training;
import com.example.projectmaghrebia.Services.ITrainingService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/trainings")
public class TrainingController {

    private final Path uploadDir = Paths.get("uploads");

    @Autowired
    private ITrainingService trainingService;

    @GetMapping("/")
    public ResponseEntity<String> index() {
        return ResponseEntity.ok("Welcome to the Training API root!");
    }

    @GetMapping
    @Operation(summary = "Get all trainings")
    public ResponseEntity<List<Training>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Training> getTrainingById(@PathVariable Long id) {
        Optional<Training> training = trainingService.getTrainingById(id);
        return training.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Training> createTraining(@Valid @RequestBody Training training) {
        Training created = trainingService.createTraining(training);
        return ResponseEntity.created(URI.create("/trainings/" + created.getTrainingId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Training> updateTraining(@PathVariable Long id, @Valid @RequestBody Training trainingDetails) {
        Optional<Training> existing = trainingService.getTrainingById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Training updated = trainingService.updateTraining(id, trainingDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        if (trainingService.getTrainingById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        trainingService.deleteTraining(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Upload image
    @PostMapping("/uploadTrainingImage/{id}")
    public ResponseEntity<Training> uploadTrainingImage(@PathVariable Long id,
                                                        @RequestParam("file") MultipartFile file) throws IOException {
        Training training = trainingService.getTrainingById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (file.isEmpty()) return ResponseEntity.badRequest().build();
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        training.setImageUrl("/trainings/files/" + filename);
        trainingService.updateTraining(id, training);

        return ResponseEntity.ok(training);
    }

    // ✅ Upload PDF
    @PostMapping("/uploadPdf/{id}")
    public ResponseEntity<Training> uploadTrainingPdf(@PathVariable Long id,
                                                      @RequestParam("file") MultipartFile file) throws IOException {
        Training training = trainingService.getTrainingById(id)
                .orElseThrow(() -> new RuntimeException("Training not found"));

        if (file.isEmpty()) return ResponseEntity.badRequest().body(null);
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        training.setCoursePdfUrl("/trainings/files/" + filename);
        trainingService.updateTraining(id, training);

        return ResponseEntity.ok(training);
    }

    // ✅ Serve any uploaded file (PDF, image, etc.)
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path file = uploadDir.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) return ResponseEntity.notFound().build();

            // 🔍 Detect MIME type (PDF, PNG, JPEG...)
            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
