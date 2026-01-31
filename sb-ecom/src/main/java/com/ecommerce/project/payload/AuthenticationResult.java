package com.ecommerce.project.payload;

import com.ecommerce.project.security.response.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseCookie;

@Data
@AllArgsConstructor
public class AuthenticationResult {
    private final ResponseCookie jwtCookie;
    private final UserProfileResponse response;
}
