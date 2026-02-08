package com.example.foodiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "foods")
public class FoodEntity {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String imageUrl;

    // 1. New field for tracking inventory
    // (null = unlimited, 0 = out of stock, >0 = available quantity)
    private Integer stock;

    // 2. Helper method to check availability
    public boolean isOutOfStock() {
        return stock != null && stock <= 0;
    }
}