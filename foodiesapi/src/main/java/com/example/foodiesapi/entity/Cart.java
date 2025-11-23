package com.example.foodiesapi.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document("cart")

public class Cart {
    @Id
    private String id;

    private String userId;

    private List<CartItem> items;

    @Data
    public static class CartItem {
        private String foodId;
        private String name;
        private double price;
        private int quantity;
    }
}
