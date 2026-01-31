package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.config.UserSpecification;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AuthenticationResult;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.security.jwt.JwtUtils;
import com.ecommerce.project.security.request.LoginRequest;
import com.ecommerce.project.security.request.SignUpRequest;
import com.ecommerce.project.security.response.MessageResponse;
import com.ecommerce.project.service.AuthService;
import com.ecommerce.project.util.Pagination;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthService authService;

    @Autowired
    private Pagination pagination;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
        AuthenticationResult authenticationResult = authService.login(loginRequest);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, authenticationResult.getJwtCookie().toString())
                .body(authenticationResult.getResponse());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest){
        return authService.register(signUpRequest);
    }

    @GetMapping("/username")
    public String username(Authentication authentication) {
        if(authentication != null)
            return authentication.getName();
        else
            return "NULL";
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser() {
        ResponseCookie cookie = authService.logoutUser();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

    @GetMapping("/sellers")
    public ResponseEntity<?> getAllSellers(@RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required=false)
                                           Integer pageNumber,
                                           @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false)
                                           Integer pageSize,
                                           @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false)
                                           String sortBy,
                                           @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false)
                                               String sortOrder,
                                           @RequestParam(name = "keyword", required = false) String keyword) {

        Pageable pageable = pagination.createPageable(pageNumber, pageSize, sortBy, sortOrder);

        Specification<User> spec = Specification.where(UserSpecification.hasRole(AppRole.ROLE_SELLER));
        if(keyword != null && !keyword.isEmpty()) {
            spec = spec.and(UserSpecification.userNameStartsWith(keyword));
        }

        return new ResponseEntity<>(authService.getAllSellers(spec, pageable), HttpStatus.OK);

    }
}
