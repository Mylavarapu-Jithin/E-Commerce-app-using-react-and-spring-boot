package com.ecommerce.project.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String jwtToken;
    private String username;
    private String email;
    private List<String> roles;
    private String imageUrl;
    private Long totalOrders;
    private Double totalSpent;

    public UserProfileResponse(Long id, List<String> roles, String username) {
        this.id = id;
        this.roles = roles;
        this.username = username;
    }

    public UserProfileResponse(Long id, String jwtToken, String username, String email, List<String> roles) {
        this.id = id;
        this.roles = roles;
        this.username = username;
        this.email = email;
        this.jwtToken = jwtToken;
    }
}