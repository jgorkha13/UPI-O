package paymentsystem.controller;

import paymentsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/lookup")
    public ResponseEntity<Map<String, Object>> lookupByPhone(
            Authentication authentication,
            @RequestParam String phone) {

        String requesterPhone = authentication.getName();

        if (phone.equals(requesterPhone)) {
            throw new RuntimeException("Cannot lookup your own number");
        }

        Map<String, Object> user = userService.lookupByPhone(phone);
        return ResponseEntity.ok(user);
    }
}
