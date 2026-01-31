package com.ecommerce.project.payload;

import com.ecommerce.project.security.response.UserProfileResponse;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SellerProfileResponse extends UserProfileResponse {
    private Long sellerProductOrdersCount;
}
