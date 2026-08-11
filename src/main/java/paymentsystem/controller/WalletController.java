package paymentsystem.controller;
import jakarta.validation.Valid;
import paymentsystem.dto.AddMoneyRequest;
import paymentsystem.model.Wallet;
import paymentsystem.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // GET /api/wallet — get my balance
    @GetMapping
    public ResponseEntity<Map<String, Object>> getWallet(
            Authentication authentication) {

        // Authentication object contains phone number from JWT
        String phone = authentication.getName();

        Wallet wallet = walletService.getWalletByPhone(phone);

        Map<String, Object> response = new HashMap<>();
        response.put("balance", wallet.getBalance());
        response.put("offlineLimit", wallet.getOfflineLimit());
        response.put("offlineSpent", wallet.getOfflineSpent());
        response.put("lastSyncAt", wallet.getLastSyncAt());

        return ResponseEntity.ok(response);
    }

    // POST /api/wallet/add — add money
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addMoney(
            Authentication authentication,
            @Valid @RequestBody AddMoneyRequest request) {

        String phone = authentication.getName();

        Wallet wallet = walletService.addMoney(phone, request.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Money added successfully");
        response.put("newBalance", wallet.getBalance());

        return ResponseEntity.ok(response);
    }
}
