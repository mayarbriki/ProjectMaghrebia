package com.example.projectmaghrebia.Services;



import com.example.projectmaghrebia.Entities.Contract;

import java.util.List;
import java.util.Optional;

public interface IContractService {
    List<Contract> getAllContracts();
    Optional<Contract> getContractById(Long id);
    Contract createContract(Contract contract);
    Contract updateContract(Long id, Contract contractDetails);
    void deleteContract(Long id);
}
