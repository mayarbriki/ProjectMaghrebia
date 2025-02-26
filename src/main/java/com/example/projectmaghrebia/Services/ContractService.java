package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Contract;
import com.example.projectmaghrebia.Repositories.ContractRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Calendar;

@Service
public class ContractService implements IContractService {

    @Autowired
    private ContractRepositories contractRepositories;

    @Autowired
    private EmailService2 emailService;

    @Override
    public List<Contract> getAllContracts() {
        return contractRepositories.findAll();
    }

    @Override
    public Optional<Contract> getContractById(Long id) {
        return contractRepositories.findById(id);
    }

    @Override
    public Contract createContract(Contract contract) {
        return contractRepositories.save(contract);
    }

    @Override
    public Contract updateContract(Long id, Contract contractDetails) {
        Contract contract = contractRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        contract.setUser_id(contractDetails.getUser_id());
        contract.setContract_type(contractDetails.getContract_type());
        contract.setStart_date(contractDetails.getStart_date());
        contract.setEnd_date(contractDetails.getEnd_date());
        contract.setStatus(contractDetails.getStatus());
        contract.setAmount(contractDetails.getAmount());
        contract.setPayment_type(contractDetails.getPayment_type());
        contract.setSigned_document(contractDetails.getSigned_document());
        contract.setUpdated_at(new java.sql.Timestamp(System.currentTimeMillis()));

        return contractRepositories.save(contract);
    }

    @Override
    public void deleteContract(Long id) {
        contractRepositories.deleteById(id);
    }

    // ✅ Tâche planifiée : vérifie les contrats expirant dans 24h et envoie des emails
    @Scheduled(cron = "0 0 8 * * ?") // S'exécute tous les jours à 8h du matin
    public void checkExpiringContracts() {
        Date now = new Date();

        // Calculer la date +24 heures
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.HOUR, 24);
        Date next24Hours = calendar.getTime();

        // Récupérer les contrats qui expirent dans les 24 heures
        List<Contract> expiringContracts = contractRepositories.findExpiringContracts(now, next24Hours);

        // Envoyer un email de rappel pour chaque contrat
        for (Contract contract : expiringContracts) {
            emailService.sendReminderEmail("client@example.com", contract.getContract_id(), contract.getContract_type());
        }
    }
}
