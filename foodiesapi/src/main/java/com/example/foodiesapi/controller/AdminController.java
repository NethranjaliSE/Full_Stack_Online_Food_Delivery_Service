package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.service.OrderService;
import com.example.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {

    private final UserService userService;
    private final OrderService orderService;

    // Get list of all delivery boys who are currently 'Available'
    @GetMapping("/delivery-boys/available")
    public ResponseEntity<List<UserEntity>> getAvailableDrivers() {
        return ResponseEntity.ok(userService.getAvailableDeliveryBoys());
    }

    // Get ALL delivery boys (for management list)
    @GetMapping("/delivery-boys")
    public ResponseEntity<List<UserEntity>> getDeliveryBoys() {
        return ResponseEntity.ok(userService.getAllDeliveryBoys());
    }

    // Admin assigns an order to a delivery boy
    @PutMapping("/orders/{orderId}/assign/{deliveryBoyId}")
    public ResponseEntity<OrderResponse> assignOrder(
            @PathVariable String orderId,
            @PathVariable String deliveryBoyId) {
        return ResponseEntity.ok(orderService.assignDeliveryBoy(orderId, deliveryBoyId));
    }
}