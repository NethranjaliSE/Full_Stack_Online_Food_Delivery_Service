package com.example.foodiesapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Foodies API - Food Delivery Service")
                        .version("1.0.0")
                        .description("Complete REST API documentation for the Full Stack Online Food Delivery Service. "
                                +
                                "This API supports customer ordering, admin food management, and delivery partner operations.")
                        .contact(new Contact()
                                .name("Foodies Development Team")
                                .email("support@foodies.lk")
                                .url("https://github.com/NethranjaliSE/Full_Stack_Online_Food_Delivery_Service"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.foodies.lk")
                                .description("Production Server (Future)")))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token obtained from /api/login endpoint")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
