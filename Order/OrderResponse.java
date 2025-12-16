package com.example.foodapi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {

    private String id;
    private String userId;
    private double amount;
    private String paypalOrderId;
    private String paymentStatus;
    private String orderStatus;
}
