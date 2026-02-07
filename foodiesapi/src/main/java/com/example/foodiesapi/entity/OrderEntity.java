package com.example.foodiesapi.entity;

import com.example.foodiesapi.io.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
    @Id
    private String id; // This 'id' will be sent to PayHere as the "order_id"

    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;

    private List<OrderItem> orderedItems;
    private double amount;
    private String currency; // e.g., "LKR"

    private String paymentStatus; // e.g., "Pending", "Success", "Failed"

    /**
     * Order Status Flow:
     * "Placed" -> "Preparing" -> "Ready for Pickup" -> "Assigned" -> "Out for Delivery" -> "Delivered"
     */
    private String orderStatus;

    // --- Delivery System Fields ---

    /**
     * Stores the User ID of the delivery boy assigned to this order.
     * Will be null until an Admin assigns it.
     */
    private String deliveryBoyId;

    /**
     * Optional: Stores the name of the delivery boy for quick access.
     */
    private String deliveryBoyName;

    // 👇 THIS IS THE NEW FIELD YOU NEED FOR THE ACCEPT/REJECT FLOW 👇
    /**
     * Tracks if the driver has accepted the assignment.
     * Values: "PENDING", "ACCEPTED", "REJECTED"
     * Default should be set to "PENDING" when Admin assigns the driver.
     */
    private String deliveryAcceptanceStatus;

    // --- PayHere Specific Fields ---
    private String payherePaymentId; // Stores the "payment_id" sent by PayHere

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
}