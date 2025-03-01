package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.FileEntity;
import com.example.projectmaghrebia.Entities.Property;
import com.example.projectmaghrebia.Repositories.FileRepository;
import com.example.projectmaghrebia.Repositories.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public FileEntity saveFile(Long propertyId, MultipartFile file) throws IOException {
        Optional<Property> property = propertyRepository.findById(propertyId);
        if (property.isPresent()) {
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(file.getOriginalFilename());
            fileEntity.setFileType(file.getContentType());
            fileEntity.setData(file.getBytes());
            fileEntity.setProperty(property.get());

            return fileRepository.save(fileEntity);
        }
        return null;
    }

    // ✅ Remove 'static' from this method
    public List<FileEntity> getFilesByProperty(Long propertyId) {
        return fileRepository.findByPropertyId(propertyId);
    }

    public byte[] getFileData(Long fileId) {
        return fileRepository.findById(fileId).map(FileEntity::getData).orElse(null);
    }
}