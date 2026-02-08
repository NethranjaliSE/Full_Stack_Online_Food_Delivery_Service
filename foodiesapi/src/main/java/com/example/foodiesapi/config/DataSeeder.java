package com.example.foodiesapi.config;

import com.example.foodiesapi.entity.FoodEntity;
import com.example.foodiesapi.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final FoodRepository foodRepository;

        @Override
        public void run(String... args) throws Exception {
                // Only seed data if the database is empty
                if (foodRepository.count() == 0) {
                        System.out.println("🌱 Seeding database with dummy food items...");

                        FoodEntity burger = FoodEntity.builder()
                                        .name("Classic Cheese Burger")
                                        .description("Juicy beef patty with cheddar cheese, lettuce, and tomato.")
                                        .price(8.99)
                                        .category("Sandwich")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60")
                                        .stock(50)
                                        .build();

                        FoodEntity pizza = FoodEntity.builder()
                                        .name("Pepperoni Feast Pizza")
                                        .description("Large pizza topped with double pepperoni and mozzarella.")
                                        .price(14.50)
                                        .category("Rolls") // Using an existing category for visibility
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=60")
                                        .stock(20)
                                        .build();

                        FoodEntity pasta = FoodEntity.builder()
                                        .name("Creamy Alfredo Pasta")
                                        .description("Fettuccine pasta in a rich parmesan cream sauce.")
                                        .price(11.25)
                                        .category("Pure Veg")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=60")
                                        .stock(30)
                                        .build();

                        FoodEntity salad = FoodEntity.builder()
                                        .name("Greek Salad")
                                        .description("Fresh lettuce, olives, feta cheese, and cucumber.")
                                        .price(6.99)
                                        .category("Salad")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60")
                                        .stock(15)
                                        .build();

                        FoodEntity chocolateCake = FoodEntity.builder()
                                        .name("Chocolate Fudge Cake")
                                        .description("Rich, moist chocolate cake with smooth fudge frosting.")
                                        .price(5.99)
                                        .category("Cake")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60")
                                        .stock(12)
                                        .build();

                        FoodEntity chickenWrap = FoodEntity.builder()
                                        .name("Grilled Chicken Wrap")
                                        .description("Grilled chicken breast with fresh veggies in a soft tortilla.")
                                        .price(7.50)
                                        .category("Rolls")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=60")
                                        .stock(25)
                                        .build();

                        FoodEntity noodles = FoodEntity.builder()
                                        .name("Spicy Thai Noodles")
                                        .description("Stir-fried noodles with vegetables in a spicy Thai sauce.")
                                        .price(9.75)
                                        .category("Noodles")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=60")
                                        .stock(18)
                                        .build();

                        FoodEntity smoothie = FoodEntity.builder()
                                        .name("Mixed Berry Smoothie")
                                        .description("Refreshing blend of strawberries, blueberries, and bananas.")
                                        .price(4.50)
                                        .category("Deserts")
                                        .imageUrl(
                                                        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=500&q=60")
                                        .stock(40)
                                        .build();

                        foodRepository.saveAll(Arrays.asList(burger, pizza, pasta, salad,
                                        chocolateCake, chickenWrap, noodles, smoothie));
                        System.out.println("✅ Dummy food items added successfully!");
                }
        }
}
