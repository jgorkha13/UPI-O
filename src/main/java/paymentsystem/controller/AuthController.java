package paymentsystem.controller;

import paymentsystem.config.JwtUtil;
import paymentsystem.dto.LoginRequest;
import paymentsystem.dto.RegisterRequest;
import paymentsystem.model.User;
import paymentsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Register API
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = userService.register(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", user.getId().toString());
        response.put("name", user.getName());

        return ResponseEntity.ok(response);
    }

    // Login API — now returns JWT token
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userService.login(request);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getPhone());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("userId", user.getId().toString());
        response.put("name", user.getName());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}