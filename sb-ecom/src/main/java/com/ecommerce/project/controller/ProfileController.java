package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AdminProfileResponse;
import com.ecommerce.project.payload.SellerProfileResponse;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.security.response.UserProfileResponse;
import com.ecommerce.project.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class ProfileController {

    @Autowired private UserProfileService profileService;
    @Autowired private UserRepository userRepository;

    @GetMapping("profile/user")
    public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
        User user = userRepository.findByUserName(authentication.getName()).get();

        String url = (user.getUserImage() != null) ?
                profileService.constructImageUrl(user.getUserImage().getFileName()) : null;

        UserProfileResponse response = profileService.getBaseProfile(user);
        response.setImageUrl(url);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("admin/profile")
    public ResponseEntity<AdminProfileResponse> getAdminProfile(Authentication authentication) {
        User user = userRepository.findByUserName(authentication.getName()).get();
        AdminProfileResponse response = profileService.getAdminProfile(user);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/seller/profile")
    public ResponseEntity<SellerProfileResponse> getSellerProfile(Authentication authentication) {
        User user = userRepository.findByUserName(authentication.getName()).get();
        SellerProfileResponse response = profileService.getSellerProfile(user);

        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}