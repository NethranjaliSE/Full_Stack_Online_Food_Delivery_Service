package com.example.food_order_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class RegisterRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    @Size(min = 6)
    private String password;

    private List<AddressDto> addresses;

    @Data
    public static class AddressDto {
        private String label;
        private String line1;
        private String city;
        private String postalCode;
    }
}
