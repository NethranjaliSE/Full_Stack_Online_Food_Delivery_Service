package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.io.OrderRequest;

public interface OrderService {
   
    OrderResponse createOrderWithPayment(OrderRequest request);
    
}