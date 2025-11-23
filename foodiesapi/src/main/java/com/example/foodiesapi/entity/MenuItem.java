package com.example.foodiesapi.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("menu")


public class MenuItem {
    @Id
    private String id;

    private String name;
    private String description;
    private double price;
    private String category;
    private String imageUrl;
}
