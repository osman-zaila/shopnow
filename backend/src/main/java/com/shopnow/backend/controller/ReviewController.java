package com.shopnow.backend.controller;

import com.shopnow.backend.entity.Review;
import com.shopnow.backend.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(
            @PathVariable Long productId
    ) {
        return reviewRepository
                .findByProductIdOrderByIdDesc(productId);
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestBody Review review,
            Authentication authentication
    ) {

        if (authentication == null ||
                authentication.getName() == null) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message",
                            "Please login before writing a review"
                    ));
        }

        if (review.getProductId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Product ID is required"
                    ));
        }

        if (review.getRating() < 1 ||
                review.getRating() > 5) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Rating must be between 1 and 5"
                    ));
        }

        if (review.getComment() == null ||
                review.getComment().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Comment is required"
                    ));
        }

        review.setUserId(null);
        review.setUserName(authentication.getName());

        Review savedReview =
                reviewRepository.save(review);

        return ResponseEntity.ok(savedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long id,
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

        Review review =
                reviewRepository.findById(id).orElse(null);

        if (review == null) {
            return ResponseEntity.notFound().build();
        }

        if (!authentication.getName()
                .equalsIgnoreCase(review.getUserName())) {

            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "You can only delete your own review"
                    ));
        }

        reviewRepository.delete(review);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Review deleted successfully"
                )
        );
    }


}
