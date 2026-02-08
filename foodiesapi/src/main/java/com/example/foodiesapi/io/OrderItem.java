package com.example.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    // 1. Changed 'foodId' to 'id' to match item.getId() in your Service
    private String id;

    private int quantity;
    private double price;
    private String category;
    private String imageUrl;
    private String description;
    private String name;
}