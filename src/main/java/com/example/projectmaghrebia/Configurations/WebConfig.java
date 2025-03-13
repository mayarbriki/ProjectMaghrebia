package com.example.projectmaghrebia.Configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Tells Spring Boot:
        // "Any request matching /uploads/** should be served from the local 'uploads' folder"
        registry.addResourceHandler("/uploads/**")
                // The "file:" prefix means we are loading files from the file system (not inside the jar).
                .addResourceLocations("file:uploads/");
    }
}