package com.shopnow.backend.controller;

import com.shopnow.backend.entity.User;
import com.shopnow.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<?> getUsers(
            Authentication authentication
    ) {

        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "Only admins can access users"
                    ));
        }

        List<User> users = userRepository.findAll();

        users.forEach(user -> user.setPassword(null));

        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user,
            Authentication authentication
    ) {

        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "Only admins can create users"
                    ));
        }

        if (user.getName() == null ||
                user.getName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Name is required"
                    ));
        }

        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Password is required"
                    ));
        }

        if (user.getPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Password must be at least 6 characters"
                    ));
        }

        if (userRepository
                .findByEmailIgnoreCase(user.getEmail().trim())
                .isPresent()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email already exists"
                    ));
        }

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("CUSTOMER");
        }

        user.setEmail(user.getEmail().trim());

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User userData,
            Authentication authentication
    ) {

        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "Only admins can update users"
                    ));
        }

        User user =
                userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Admin user cannot be edited"
                    ));
        }

        if (userData.getName() != null &&
                !userData.getName().isBlank()) {

            user.setName(userData.getName().trim());
        }

        if (userData.getEmail() != null &&
                !userData.getEmail().isBlank()) {

            String newEmail =
                    userData.getEmail().trim();

            User existingUser =
                    userRepository
                            .findByEmailIgnoreCase(newEmail)
                            .orElse(null);

            if (existingUser != null &&
                    !existingUser.getId()
                            .equals(user.getId())) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Email already exists"
                        ));
            }

            user.setEmail(newEmail);
        }

        if (userData.getRole() != null &&
                !userData.getRole().isBlank()) {

            user.setRole(
                    userData.getRole().trim().toUpperCase()
            );
        }

        User updatedUser =
                userRepository.save(user);

        updatedUser.setPassword(null);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> data,
            Authentication authentication
    ) {

        if (authentication == null ||
                authentication.getName() == null) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message",
                            "Please login first"
                    ));
        }

        User user =
                userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isAdmin =
                isAdmin(authentication);

        boolean isOwner =
                user.getEmail() != null &&
                        user.getEmail()
                                .equalsIgnoreCase(
                                        authentication.getName()
                                );

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "You can only change your own password"
                    ));
        }

        String currentPassword =
                data.get("currentPassword");

        String newPassword =
                data.get("newPassword");

        String confirmPassword =
                data.get("confirmPassword");

        if (currentPassword == null ||
                currentPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Current password is required"
                    ));
        }

        if (newPassword == null ||
                newPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New password is required"
                    ));
        }

        if (confirmPassword == null ||
                confirmPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Please confirm your new password"
                    ));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New password must be at least 6 characters"
                    ));
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New passwords do not match"
                    ));
        }

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword()
        )) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message",
                            "Current password is incorrect"
                    ));
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            Authentication authentication
    ) {

        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "Only admins can delete users"
                    ));
        }

        User user =
                userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Admin user cannot be deleted"
                    ));
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User deleted successfully"
                )
        );
    }

    private boolean isAdmin(
            Authentication authentication
    ) {

        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN")
                );
    }

}
