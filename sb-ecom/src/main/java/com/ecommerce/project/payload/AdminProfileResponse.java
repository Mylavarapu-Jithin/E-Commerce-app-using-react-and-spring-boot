package com.ecommerce.project.payload;

import com.ecommerce.project.security.response.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminProfileResponse extends SellerProfileResponse {
    private Long totalApplicationOrders;
}
