package com.example.foodiesapi.controller;

import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.service.DeliveryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@AllArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    // Get orders assigned to the logged-in delivery boy
    @GetMapping("/my-orders/{deliveryBoyId}")
    public ResponseEntity<List<OrderResponse>> getMyTasks(@PathVariable String deliveryBoyId) {
        return ResponseEntity.ok(deliveryService.getOrdersForDriver(deliveryBoyId));
    }

    // Update status (e.g., from 'ASSIGNED' to 'ON THE WAY' or 'DELIVERED')
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        deliveryService.updateDeliveryStatus(orderId, status);
        return ResponseEntity.ok().build();
    }
}