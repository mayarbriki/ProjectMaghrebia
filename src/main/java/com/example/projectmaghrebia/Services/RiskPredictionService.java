package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Contract;
import org.springframework.stereotype.Service;

@Service
public class RiskPredictionService {

    public String predictRisk(Contract contract) {
        if (contract.getAmount().compareTo(new java.math.BigDecimal(100)) < 0) {
            return "Low";
        } else if (contract.getAmount().compareTo(new java.math.BigDecimal(500)) < 0) {
            return "Medium";
        } else {
            return "High";
        }
    }
}
