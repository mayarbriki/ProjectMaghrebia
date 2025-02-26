package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ContractRepositories  extends JpaRepository<Contract,Long> {

    @Query("SELECT c FROM Contract c WHERE c.end_date BETWEEN :now AND :next24Hours")
    List<Contract> findExpiringContracts(Date now, Date next24Hours);

}
