package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.FileEntity;
import com.example.projectmaghrebia.Services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "http://localhost:4200")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload/{propertyId}")
    public ResponseEntity<String> uploadFile(@PathVariable Long propertyId, @RequestParam("file") MultipartFile file) {
        try {
            FileEntity savedFile = fileService.saveFile(propertyId, file);
            return ResponseEntity.ok("File uploaded successfully: " + savedFile.getFileName());
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("File upload failed.");
        }
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<FileEntity>> getFilesByProperty(@PathVariable Long propertyId) {
        List<FileEntity> files = fileService.getFilesByProperty(propertyId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) {
        byte[] fileData = fileService.getFileData(fileId);
        if (fileData != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=file_" + fileId)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
