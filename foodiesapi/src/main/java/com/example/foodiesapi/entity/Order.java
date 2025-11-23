package com.example.foodiesapi.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document("orders")

public class Order {

    @Id
    private String id;

    private String userId;
    private List<OrderItem> items;
    private double totalAmount;
    private String status; // Pending / Completed
    private LocalDateTime createdAt;

    @Data
    public static class OrderItem {
        private String foodId;
        private String name;
        private double price;
        private int quantity;
    }

}
