package paymentsystem.service;

import paymentsystem.dto.LoginRequest;
import paymentsystem.dto.RegisterRequest;
import paymentsystem.model.User;
import paymentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private WalletService walletService;

    // Register a new user and create wallet
    @Transactional
    public User register(RegisterRequest request) {

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        // Auto create wallet for new user
        walletService.createWallet(savedUser);

        return savedUser;
    }

    // Login
    public User login(LoginRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public Map<String, Object> lookupByPhone(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found with this number"));

        Map<String, Object> response = new HashMap<>();
        response.put("name", user.getName());
        response.put("phone", user.getPhone());
        response.put("upiId", user.getPhone() + "@upio");
        return response;
    }
}