package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile/image")
public class UserImageController {

    @Autowired private UserProfileService profileService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file, Authentication auth) throws IOException {
        User user = userRepository.findByUserName(auth.getName()).get();
        String url = profileService.updateProfilePicture(user, file);
        return ResponseEntity.ok(url);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteImage(Authentication auth) throws IOException {
        User user = userRepository.findByUserName(auth.getName()).get();
        profileService.deleteProfilePicture(user);
        return ResponseEntity.ok("Profile picture deleted successfully");
    }

}
