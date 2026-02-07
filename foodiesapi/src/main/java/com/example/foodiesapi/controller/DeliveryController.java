package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.UserEntity;
import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.repository.UserRepository;
import com.example.foodiesapi.service.DeliveryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery")
@AllArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final UserRepository userRepository;

    // 1. DISCOVERY ENDPOINT (Fixes "Undefined ID")
    @GetMapping("/user-by-email/{email}")
    public ResponseEntity<UserEntity> getUserByEmail(@PathVariable String email) {
        Optional<UserEntity> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 2. ADMIN: GET ALL DRIVERS (For your new List Page)
    @GetMapping("/all-delivery-personnel")
    public ResponseEntity<List<UserEntity>> getAllDeliveryPersonnel() {
        return ResponseEntity.ok(userRepository.findByRole("ROLE_DELIVERY"));
    }

    // 3. DRIVER: ACCEPT/REJECT ORDER
    @PatchMapping("/orders/{orderId}/respond")
    public ResponseEntity<?> respondToOrder(
            @PathVariable String orderId,
            @RequestParam boolean accept) {
        deliveryService.respondToAssignment(orderId, accept);
        return ResponseEntity.ok("Response recorded");
    }

    // --- EXISTING METHODS ---
    @GetMapping("/my-orders/{deliveryBoyId}")
    public ResponseEntity<List<OrderResponse>> getMyTasks(@PathVariable String deliveryBoyId) {
        if (deliveryBoyId == null || "undefined".equals(deliveryBoyId)) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(deliveryService.getOrdersForDriver(deliveryBoyId));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable String orderId, @RequestParam String status) {
        deliveryService.updateDeliveryStatus(orderId, status);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/availability/{userId}")
    public ResponseEntity<?> toggleAvailability(@PathVariable String userId, @RequestParam boolean isAvailable) {
        if (userId == null || "undefined".equals(userId)) return ResponseEntity.badRequest().body("Invalid User ID");
        deliveryService.updateAvailability(userId, isAvailable);
        return ResponseEntity.ok("Status updated");
    }

    @GetMapping("/available-drivers")
    public ResponseEntity<List<UserEntity>> getAvailableDrivers() {
        return ResponseEntity.ok(deliveryService.getAvailableDrivers());
    }

    @PatchMapping("/assign-order")
    public ResponseEntity<?> assignDriver(@RequestBody Map<String, String> payload) {
        deliveryService.assignDriverToOrder(payload.get("orderId"), payload.get("driverId"));
        return ResponseEntity.ok("Assigned");
    }
}