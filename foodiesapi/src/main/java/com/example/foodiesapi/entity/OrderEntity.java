package com.example.foodiesapi.entity;

import com.example.foodiesapi.io.OrderItem;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
@Data
@Builder
public class OrderEntity {
    @Id
    private String id; // This 'id' will be sent to PayHere as the "order_id"

    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;

    private List<OrderItem> orderedItems;
    private double amount;
    private String currency; // Added: e.g., "LKR"

    private String paymentStatus; // e.g., "Pending", "Success", "Failed"

    /**
     * Updated orderStatus flow:
     * "Placed" -> "Preparing" -> "Ready for Pickup" -> "On the Way" -> "Delivered"
     */
    private String orderStatus;

    // --- Delivery System Fields ---

    /**
     * Stores the User ID of the delivery boy assigned to this order.
     * Will be null until an Admin assigns it.
     */
    private String deliveryBoyId;

    /**
     * Optional: Stores the name or phone of the delivery boy for quick access
     * without needing to query the User collection every time.
     */
    private String deliveryBoyName;

    // --- PayHere Specific Fields ---
    private String payherePaymentId; // Stores the "payment_id" sent by PayHere

}