package in.bushansirgur.foodiesapi.io;

import lombok.data;
import lombok.Builder;

@data
@Builder

public class OrderResponse {
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String paymentStatus;
    private String razorpayOrderId;
    private String orderStatus;
}

