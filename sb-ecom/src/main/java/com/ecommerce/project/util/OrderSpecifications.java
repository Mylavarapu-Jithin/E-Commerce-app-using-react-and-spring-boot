package com.ecommerce.project.util;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.Product;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

@Component
public class OrderSpecifications {

    public static Specification<Order> searchBy(
            String keyword,
            OrderSearchField field
    ) {
        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            Path<?> path = root.get(field.getField());

            if (path.getJavaType().equals(String.class)) {
                return cb.like(cb.lower(path.as(String.class)),
                        "%" + keyword.toLowerCase() + "%");
            }

            if (path.getJavaType().equals(Long.class)) {
                return cb.equal(path.as(Long.class), Long.valueOf(keyword));
            }

            if (path.getJavaType().equals(Double.class)) {
                return cb.equal(path.as(Double.class), Double.valueOf(keyword));
            }

            if (path.getJavaType().equals(LocalDate.class)) {
                try {
                    LocalDate date = LocalDate.parse(keyword);
                    return cb.equal(path.as(LocalDate.class), date);
                } catch (DateTimeParseException e) {
                    return cb.conjunction();
                }
            }
            return cb.conjunction();
        };
    }

    public static Specification<Order> adminScope() {
        return (root, query, cb) -> cb.conjunction();
    }

    public static Specification<Order> userScope(String email) {
        return (root, query, cb) ->
                cb.equal(cb.lower(root.get("email")), email.toLowerCase());
    }

    public static Specification<Order> sellerScope(Long sellerId) {
        return (root, query, cb) -> {
            query.distinct(true);

            Join<Order, OrderItem> orderItems = root.join("orderItems");
            Join<OrderItem, Product> product = orderItems.join("product");

            return cb.equal(product.get("user").get("userId"), sellerId);
        };
    }
}
