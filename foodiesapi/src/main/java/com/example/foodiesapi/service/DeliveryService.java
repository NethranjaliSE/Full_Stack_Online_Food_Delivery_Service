package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.OrderResponse;
import java.util.List;

public interface DeliveryService {

    // --- Driver Side ---
    List<OrderResponse> getOrdersForDriver(String deliveryBoyId);
    void updateDeliveryStatus(String orderId, String status);

    // NEW: Driver Accepts or Rejects the order
    void respondToAssignment(String orderId, boolean accepted);

    // --- Admin Side ---
    void updateAvailability(String userId, boolean isAvailable);

    // Get ONLY available drivers (for dropdowns)
    List<UserEntity> getAvailableDrivers();

    // Assign a driver to an order
    void assignDriverToOrder(String orderId, String driverId);
}