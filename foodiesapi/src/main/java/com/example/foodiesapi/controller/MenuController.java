package com.example.foodiesapi.controller;

import com.example.foodiesapi.entity.MenuItem;
import com.example.foodiesapi.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin
public class MenuController {

    private final MenuService service;

    @GetMapping
    public List<MenuItem> getAll() {
        return service.getAllMenu();
    }

    @GetMapping("/category/{category}")
    public List<MenuItem> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }

    @GetMapping("/search")
    public List<MenuItem> search(@RequestParam String name) {
        return service.searchByName(name);
    }

    @GetMapping("/{id}")
    public MenuItem getItem(@PathVariable String id) {
        return service.getItem(id);
    }
}
