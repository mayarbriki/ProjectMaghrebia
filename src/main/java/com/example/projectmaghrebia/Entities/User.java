package com.example.projectmaghrebia.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Data // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates an all-args constructor
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    private String email;



    private String phoneNumber;

    private String address;
@Enumerated(EnumType.STRING)
    private Role role; // e.g., "ADMIN", "CUSTOMER", "AGENT"
    private String image ;


}