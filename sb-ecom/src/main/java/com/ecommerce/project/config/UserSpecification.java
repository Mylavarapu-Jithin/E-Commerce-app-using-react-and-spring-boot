package com.ecommerce.project.config;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecification {

    private UserSpecification() {}

    public static Specification<User> hasRole(AppRole role) {
        return (root, query, cb) -> {
            query.distinct(true);
            return root
                    .join("roles")
                    .get("roleName")
                    .in(role);
        };
    }

    public static Specification<User> userNameStartsWith(String keyword) {
        return (root, query, cb) ->
                cb.like(
                        cb.lower(root.get("userName")),
                        keyword.toLowerCase() + "%"
                );
    }
}
