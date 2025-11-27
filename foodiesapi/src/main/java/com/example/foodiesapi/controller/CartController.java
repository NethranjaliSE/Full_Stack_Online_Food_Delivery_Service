package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.Cart;
import com.example.foodiesapi.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin
public class CartController {

    private final CartService service;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return service.getCart(userId);
    }

    @PostMapping("/{userId}/add")
    public Cart addToCart(@PathVariable String userId, @RequestBody Cart.CartItem item) {
        return service.addToCart(userId, item);
    }

    @DeleteMapping("/{userId}/remove/{foodId}")
    public Cart removeFromCart(@PathVariable String userId, @PathVariable String foodId) {
        return service.removeFromCart(userId, foodId);
    }
}
