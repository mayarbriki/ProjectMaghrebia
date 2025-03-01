package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Contract;
import com.example.projectmaghrebia.Entities.Payment_frequency;
import com.example.projectmaghrebia.Repositories.ContractRepositories;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
        if (contract.getContract_id() != null && contract.getContract_id() == 0) {
            contract.setContract_id(null); // ✅ Let Hibernate generate the ID
        }

        // ✅ Ensure declared_amount is not null
        if (contract.getAmount() == null) {
            contract.setAmount(BigDecimal.ZERO);
        }

        BigDecimal calculatedAmount = calculateInsurance(contract.getAmount(), contract.getPayment_type());
        contract.setAmount(calculatedAmount);

        return contractRepositories.save(contract);
    }

    @Override
    @Transactional
    public Contract updateContract(Long id, Contract contractDetails) {
        Contract contract = contractRepositories.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        contract.setUser_id(contractDetails.getUser_id());
        contract.setContract_type(contractDetails.getContract_type());
        contract.setStart_date(contractDetails.getStart_date());
        contract.setEnd_date(contractDetails.getEnd_date());
        contract.setPayment_type(contractDetails.getPayment_type());
        contract.setSigned_document(contractDetails.getSigned_document());
        contract.setUpdated_at(new java.sql.Timestamp(System.currentTimeMillis()));

        // ✅ Ensure declared_amount is not null
        if (contractDetails.getAmount() == null) {
            contractDetails.setAmount(BigDecimal.ZERO);
        }

        BigDecimal calculatedAmount = calculateInsurance(contractDetails.getAmount(), contractDetails.getPayment_type());
        contract.setAmount(calculatedAmount);

        return contractRepositories.save(contract);
    }

    @Override
    public void deleteContract(Long id) {
        contractRepositories.deleteById(id);
    }

    @Scheduled(cron = "0 0 8 * * ?")
    public void checkExpiringContracts() {
        Date now = new Date();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.HOUR, 24);
        Date next24Hours = calendar.getTime();

        List<Contract> expiringContracts = contractRepositories.findExpiringContracts(now, next24Hours);

        for (Contract contract : expiringContracts) {
            emailService.sendReminderEmail("client@example.com", contract.getContract_id(), contract.getContract_type());
        }
    }

    public BigDecimal calculateInsurance(BigDecimal declaredAmount, Payment_frequency paymentFrequency) {
        if (declaredAmount == null) {
            declaredAmount = BigDecimal.ZERO; // ✅ Default value
        }

        BigDecimal insuranceBase;

        if (declaredAmount.compareTo(BigDecimal.valueOf(10000)) >= 0) {
            insuranceBase = BigDecimal.valueOf(500);
        } else {
            insuranceBase = declaredAmount.multiply(BigDecimal.valueOf(0.05));
        }

        switch (paymentFrequency) {
            case MONTHLY:
                return insuranceBase.divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP);
            case YEARLY:
                return insuranceBase;
            case ONE_TIME:
                return insuranceBase.multiply(BigDecimal.valueOf(1.1));
            default:
                return insuranceBase;
        }
    }
}
