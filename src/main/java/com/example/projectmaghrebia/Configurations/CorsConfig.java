package com.example.projectmaghrebia.Configurations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfig corsConfigurer() {
        return new CorsConfig() {

            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("") // Allow CORS for all endpoints under /api
                        .allowedOrigins("http://localhost:4200") // Allow requests from Angular frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}