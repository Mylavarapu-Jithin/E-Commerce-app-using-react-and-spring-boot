package com.ecommerce.project.service;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AdminProfileResponse;
import com.ecommerce.project.payload.SellerProfileResponse;
import com.ecommerce.project.security.response.UserProfileResponse;
import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserProfileService {

    UserProfileResponse getBaseProfile(User user);
    AdminProfileResponse getAdminProfile(User user);
    SellerProfileResponse getSellerProfile(User user);

    String constructImageUrl(String fileName);

    @Transactional
    String updateProfilePicture(User user, MultipartFile file) throws IOException;

    @Transactional
    void deleteProfilePicture(User user) throws IOException;
}
