package com.shopnow.backend.config;

import com.shopnow.backend.entity.User;
import com.shopnow.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        return args -> {

            User admin = userRepository
                    .findByEmailIgnoreCase("admin@gmail.com")
                    .orElse(null);

            if (admin != null && !admin.getPassword().startsWith("$2a$")) {
                admin.setPassword(
                        passwordEncoder.encode(admin.getPassword())
                );
                userRepository.save(admin);
            }

            User customer = userRepository
                    .findByEmailIgnoreCase("osman@gmail.com")
                    .orElse(null);

            if (customer != null && !customer.getPassword().startsWith("$2a$")) {
                customer.setPassword(
                        passwordEncoder.encode(customer.getPassword())
                );
                userRepository.save(customer);
            }
        };
    }
}