package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Property;
import com.example.projectmaghrebia.Repositories.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class PropertyServiceImpl {

    @Autowired
    private PropertyRepository propertyRepository;

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getPropertyById(UUID id) {
        return propertyRepository.findById(id);
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(UUID id, Property updatedProperty) {
        if (propertyRepository.existsById(id)) {
            updatedProperty.setProperty_id(id);
            return propertyRepository.save(updatedProperty);
        }
        return null;
    }

    public void deleteProperty(UUID id) {
        propertyRepository.deleteById(id);
    }
}
