package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Property;
import java.util.List;
import java.util.Optional;

public interface IPropertyService {
    List<Property> getAllProperties();
    Optional<Property> getPropertyById(Long id);
    Property saveProperty(Property property);
    Property updateProperty(Long id, Property propertyDetails);
    void deleteProperty(Long id);
}
