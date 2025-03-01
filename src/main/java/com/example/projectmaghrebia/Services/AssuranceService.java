package com.example.projectmaghrebia.Services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class AssuranceService  {
    public BigDecimal calculerMontantTransaction(BigDecimal totalAmount, String frequency, LocalDate startDate, LocalDate endDate) {
    if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
        throw new IllegalArgumentException("Invalid contract amount!");
    }
    if (frequency == null) {
        throw new IllegalArgumentException("Payment frequency is required!");
    }

    switch (frequency.toLowerCase()) {
        case "yearly":
            long years = ChronoUnit.YEARS.between(startDate, endDate);
            return years > 0 ? totalAmount.divide(BigDecimal.valueOf(years), 2, BigDecimal.ROUND_HALF_UP) : totalAmount;

        case "monthly":
            long months = ChronoUnit.MONTHS.between(startDate, endDate);
            return months > 0 ? totalAmount.divide(BigDecimal.valueOf(months), 2, BigDecimal.ROUND_HALF_UP) : totalAmount;

        case "one-time":
            return totalAmount;

        default:
            throw new IllegalArgumentException("Invalid payment frequency!");
    }
}
}
