package com.example.projectmaghrebia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ProjectMaghrebiaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectMaghrebiaApplication.class, args);
	}

}
