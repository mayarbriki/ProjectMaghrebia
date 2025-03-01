package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Contract;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepositories  extends JpaRepository<Contract,Long> {

    @Query("SELECT c FROM Contract c WHERE c.end_date BETWEEN :now AND :next24Hours")
    List<Contract> findExpiringContracts(Date now, Date next24Hours);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Contract c WHERE c.contract_id = :id")
    Optional<Contract> findByIdForUpdate(@Param("id") Long id);
}
