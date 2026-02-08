package com.example.foodiesapi.service;

import com.example.foodiesapi.entity.FoodEntity;
import com.example.foodiesapi.entity.OrderEntity;
import com.example.foodiesapi.io.OrderRequest;
import com.example.foodiesapi.io.OrderResponse;
import com.example.foodiesapi.repository.CartRespository;
import com.example.foodiesapi.repository.FoodRepository;
import com.example.foodiesapi.repository.OrderRepository;
import com.example.foodiesapi.repository.UserRepository; // Import UserRepository
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final FoodRepository foodRepository;
    private final UserRepository userRepository; // Added to manage delivery boy status

    @Value("${payhere_merchant_id}")
    private String MERCHANT_ID;

    @Value("${payhere_merchant_secret}")
    private String MERCHANT_SECRET;

    /**
     * NEW: ASSIGN DELIVERY BOY
     * Admin uses this to link a delivery boy to an order.
     */
    @Override
    @Transactional
    public OrderResponse assignDeliveryBoy(String orderId, String deliveryBoyId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // Update Order fields
        order.setDeliveryBoyId(deliveryBoyId);
        order.setOrderStatus("ASSIGNED");

        // Update Delivery Boy availability (Mark as busy)
        userService.updateAvailability(deliveryBoyId, false);

        order = orderRepository.save(order);
        return convertToResponse(order);
    }

    /**
     * NEW: GET DELIVERY BOY ORDERS
     * Fetches tasks specifically for the logged-in delivery driver.
     */
    @Override
    public List<OrderResponse> getDeliveryBoyOrders(String deliveryBoyId) {
        return orderRepository.findByDeliveryBoyId(deliveryBoyId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // --- EXISTING METHODS (Modified only where necessary) ---

    @Override
    @Transactional
    public Map<String, Object> initiatePayHereCheckout(OrderRequest request) {
        request.getOrderedItems().forEach(item -> {
            FoodEntity food = foodRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Food item not found: " + item.getName()));
            if (food.getStock() != null) {
                if (food.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Out of stock: " + food.getName());
                }
                food.setStock(food.getStock() - item.getQuantity());
                foodRepository.save(food);
            }
        });

        OrderEntity newOrder = convertToEntity(request);
        String loggedInUserId = userService.findByUserId();
        newOrder.setUserId(loggedInUserId);
        newOrder.setCurrency("LKR");
        newOrder.setPaymentStatus("Pending");
        newOrder = orderRepository.save(newOrder);

        double amount = newOrder.getAmount();
        String orderId = newOrder.getId();
        String currency = "LKR";

        DecimalFormat df = new DecimalFormat("0.00");
        String amountFormatted = df.format(amount);
        String hash = generatePayHereHash(MERCHANT_ID, orderId, amountFormatted, currency, MERCHANT_SECRET);

        Map<String, Object> payHereData = new HashMap<>();
        payHereData.put("sandbox", true);
        payHereData.put("merchant_id", MERCHANT_ID);
        payHereData.put("return_url", "http://localhost:5173/myorders"); // Updated for your port
        payHereData.put("cancel_url", "http://localhost:5173/cart");
        payHereData.put("notify_url", "http://your-backend-url/api/orders/notify");
        payHereData.put("order_id", orderId);
        payHereData.put("items", "Food Order #" + orderId);
        payHereData.put("amount", amountFormatted);
        payHereData.put("currency", currency);
        payHereData.put("hash", hash);
        payHereData.put("email", newOrder.getEmail());
        payHereData.put("phone", newOrder.getPhoneNumber());
        payHereData.put("address", newOrder.getUserAddress());

        return payHereData;
    }

    @Override
    public void handlePayHereNotification(Map<String, String> paymentData) {
        String orderId = paymentData.get("order_id");
        String statusCode = paymentData.get("status_code");
        String payHerePaymentId = paymentData.get("payment_id");

        OrderEntity existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if ("2".equals(statusCode)) {
            existingOrder.setPaymentStatus("Paid");
            existingOrder.setPayherePaymentId(payHerePaymentId);
            existingOrder.setOrderStatus("Placed");
            cartRespository.deleteByUserId(existingOrder.getUserId());
        } else {
            existingOrder.setPaymentStatus("Failed");
        }
        orderRepository.save(existingOrder);
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        return orderRepository.findByUserId(loggedInUserId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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

        // If the order is DELIVERED, make the delivery boy available again
        if ("DELIVERED".equalsIgnoreCase(status) && entity.getDeliveryBoyId() != null) {
            userService.updateAvailability(entity.getDeliveryBoyId(), true);
        }

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
                // Ensure the response object has a deliveryBoyId field if you want to see it in Frontend
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