package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.FoodEntity; // Import FoodEntity
import com.example.foodiesapi.entity.OrderEntity;
import com.example.foodiesapi.io.OrderRequest;
import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.repository.CartRespository;
import com.example.foodiesapi.repository.FoodRepository; // Import FoodRepository
import com.example.foodiesapi.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartRespository cartRespository;
    private final FoodRepository foodRepository; // 1. Inject FoodRepository

    // --- PAYHERE CREDENTIALS ---
    @Value("${payhere_merchant_id}")
    private String MERCHANT_ID;

    @Value("${payhere_merchant_secret}")
    private String MERCHANT_SECRET;

    private final String PAYHERE_URL = "https://sandbox.payhere.lk/pay/checkout";

    /**
     * 1. INITIATE CHECKOUT
     * Creates the order, DEDUCTS STOCK, then generates the PayHere Hash.
     */
    @Override
    @Transactional // 2. Add Transactional (So if payment fails setup, stock rollback happens)
    public Map<String, Object> initiatePayHereCheckout(OrderRequest request) {

        // --- A. STOCK CHECK & UPDATE LOGIC ---
        // We iterate through items to check and deduct stock BEFORE creating the order
        request.getOrderedItems().forEach(item -> {
            // Assuming your item object has getId() for foodId and getQuantity()
            FoodEntity food = foodRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Food item not found: " + item.getName()));

            // Check if stock tracking is enabled (not null)
            if (food.getStock() != null) {
                if (food.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Out of stock: " + food.getName());
                }

                // Deduct stock
                food.setStock(food.getStock() - item.getQuantity());
                foodRepository.save(food);
            }
        });

        // --- B. Convert Request to Entity ---
        OrderEntity newOrder = convertToEntity(request);

        // --- C. Set current user ID ---
        String loggedInUserId = userService.findByUserId();
        newOrder.setUserId(loggedInUserId);
        newOrder.setCurrency("LKR");
        newOrder.setPaymentStatus("Pending");

        // --- D. Save to DB ---
        newOrder = orderRepository.save(newOrder);

        // --- E. Generate PayHere Security Hash ---
        double amount = newOrder.getAmount();
        String orderId = newOrder.getId();
        String currency = "LKR";

        DecimalFormat df = new DecimalFormat("0.00");
        String amountFormatted = df.format(amount);

        String hash = generatePayHereHash(MERCHANT_ID, orderId, amountFormatted, currency, MERCHANT_SECRET);

        // --- F. Prepare Data for Frontend ---
        Map<String, Object> payHereData = new HashMap<>();
        payHereData.put("sandbox", true);
        payHereData.put("merchant_id", MERCHANT_ID);
        payHereData.put("return_url", "http://localhost:3000/orders");
        payHereData.put("cancel_url", "http://localhost:3000/cart");
        payHereData.put("notify_url", "http://your-backend-url/api/orders/notify");
        payHereData.put("order_id", orderId);
        payHereData.put("items", "Food Order #" + orderId);
        payHereData.put("amount", amountFormatted);
        payHereData.put("currency", currency);
        payHereData.put("hash", hash);
        payHereData.put("first_name", "User");
        payHereData.put("last_name", "Name");
        payHereData.put("email", newOrder.getEmail());
        payHereData.put("phone", newOrder.getPhoneNumber());
        payHereData.put("address", newOrder.getUserAddress());
        payHereData.put("city", "Colombo");
        payHereData.put("country", "Sri Lanka");

        return payHereData;
    }

    /**
     * 2. HANDLE NOTIFICATION (WebHook)
     */
    @Override
    public void handlePayHereNotification(Map<String, String> paymentData) {
        String orderId = paymentData.get("order_id");
        String statusCode = paymentData.get("status_code"); // 2 = Success, 0 = Pending, -1 = Canceled
        String payHerePaymentId = paymentData.get("payment_id");

        OrderEntity existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if ("2".equals(statusCode)) {
            existingOrder.setPaymentStatus("Paid");
            existingOrder.setPayherePaymentId(payHerePaymentId);
            existingOrder.setOrderStatus("Placed");
            cartRespository.deleteByUserId(existingOrder.getUserId());
        } else if ("-1".equals(statusCode) || "-2".equals(statusCode)) {
            // OPTIONAL: If payment failed, you might want to RESTORE the stock here.
            // That logic would involve looping through existingOrder.getOrderedItems()
            // and adding the quantity back to the foodRepository.
            existingOrder.setPaymentStatus("Failed");
        } else {
            existingOrder.setPaymentStatus("Failed");
        }

        orderRepository.save(existingOrder);
    }

    // --- Standard Methods ---

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    // --- Helper Methods ---

    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String merchantSecret) {
        String secretHash = getMd5(merchantSecret).toUpperCase();
        String stringToHash = merchantId + orderId + amount + currency + secretHash;
        return getMd5(stringToHash).toUpperCase();
    }

    private String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : messageDigest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating MD5 hash", e);
        }
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .currency(newOrder.getCurrency())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderedItems())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build();
    }
}