
package com.example.projectmaghrebia.Controllers;
import com.example.projectmaghrebia.Entities.Contract;
import com.example.projectmaghrebia.Services.ContractService;
import com.example.projectmaghrebia.Services.RiskPredictionService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/predict-risk")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Permet à Angular d’accéder à l’API
public class RiskPredictionController {

    private final RiskPredictionService riskPredictionService;
    private final ContractService contractService;

    public RiskPredictionController(RiskPredictionService riskPredictionService, ContractService contractService) {
        this.riskPredictionService = riskPredictionService;
        this.contractService = contractService;
    }

    @PostMapping
    public Map<String, String> predictRisk(@RequestBody Contract contract) {
        String riskLevel = riskPredictionService.predictRisk(contract);

        // ✅ Met à jour le contrat avec le score de risque
        contract.setRiskScore(riskLevel);
        contractService.updateContract(contract.getContract_id(), contract);

        // ✅ Retourne la réponse JSON avec le niveau de risque
        Map<String, String> response = new HashMap<>();
        response.put("risk", riskLevel);
        return response;
    }
}
