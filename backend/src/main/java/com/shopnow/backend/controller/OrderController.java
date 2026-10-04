package com.shopnow.backend.controller;

import com.shopnow.backend.dto.OrderItemRequest;
import com.shopnow.backend.dto.OrderRequest;
import com.shopnow.backend.entity.Order;
import com.shopnow.backend.entity.OrderItem;
import com.shopnow.backend.entity.Product;
import com.shopnow.backend.repository.OrderItemRepository;
import com.shopnow.backend.repository.OrderRepository;
import com.shopnow.backend.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/orders")
public class OrderController {


    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders(Authentication authentication) {

        if (isAdmin(authentication)) {
            return ResponseEntity.ok(orderRepository.findAll());
        }

        return ResponseEntity.status(403)
                .body(Map.of("message", "Access denied"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (isAdmin(authentication)) {
            return ResponseEntity.ok(order);
        }

        if (isOwner(order, authentication)) {
            return ResponseEntity.ok(order);
        }

        return ResponseEntity.status(403)
                .body(Map.of("message", "You cannot access this order"));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getOrdersByEmail(
            @PathVariable String email,
            Authentication authentication
    ) {

        if (isAdmin(authentication)) {
            return ResponseEntity.ok(orderRepository.findByEmail(email));
        }

        if (!authentication.getName().equalsIgnoreCase(email)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You can only access your own orders"));
        }

        return ResponseEntity.ok(orderRepository.findByEmail(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication
    ) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Order items are required"));
        }

        String userEmail = authentication.getName();

        double totalPrice = 0;

        for (OrderItemRequest itemRequest : request.getItems()) {

            if (itemRequest.getProductId() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Product ID is required"));
            }

            if (itemRequest.getQuantity() <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Quantity must be greater than 0"));
            }

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElse(null);

            if (product == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Product not found: " + itemRequest.getProductId()
                        ));
            }

            if (product.getStock() < itemRequest.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Not enough stock for product: " + product.getName(),
                                "availableStock",
                                product.getStock()
                        ));
            }

            totalPrice += product.getPrice() * itemRequest.getQuantity();
        }

        String deliveryCode = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        Order savedOrder = new Order(
                request.getFullName(),
                userEmail,
                request.getPhone(),
                request.getAddress(),
                request.getCity(),
                request.getPaymentMethod(),
                totalPrice
        );

        savedOrder.setDeliveryCode(deliveryCode);
        savedOrder.setStatus("Pending");

        Order finalOrder = orderRepository.save(savedOrder);

        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElse(null);

            if (product == null) {
                continue;
            }

            OrderItem orderItem = new OrderItem(
                    finalOrder,
                    product,
                    itemRequest.getQuantity(),
                    product.getPrice()
            );

            orderItemRepository.save(orderItem);

            product.setStock(
                    product.getStock() - itemRequest.getQuantity()
            );

            productRepository.save(product);
        }

        return ResponseEntity.ok(
                orderRepository.findById(finalOrder.getId())
                        .orElse(finalOrder)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> data,
            Authentication authentication
    ) {

        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Only admins can update order status"));
        }

        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        String status = data.get("status");

        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Status is required"));
        }

        order.setStatus(status);

        Order updatedOrder = orderRepository.save(order);

        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!isOwner(order, authentication)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "You can only cancel your own order"));
        }

        if (!"Pending".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Only Pending orders can be cancelled"
                    ));
        }

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        for (OrderItem orderItem : orderItems) {

            Product product = orderItem.getProduct();

            product.setStock(
                    product.getStock() + orderItem.getQuantity()
            );

            productRepository.save(product);
        }

        order.setStatus("Cancelled");

        Order cancelledOrder = orderRepository.save(order);

        return ResponseEntity.ok(cancelledOrder);
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                );
    }

    private boolean isOwner(
            Order order,
            Authentication authentication
    ) {
        return order.getEmail() != null
                && authentication.getName() != null
                && order.getEmail().equalsIgnoreCase(authentication.getName());
    }


}
