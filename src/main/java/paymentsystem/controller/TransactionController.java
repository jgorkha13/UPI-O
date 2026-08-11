package paymentsystem.controller;
import paymentsystem.model.Transaction;
import paymentsystem.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMoney(
            Authentication authentication,
            @RequestBody Map<String, Object> request) {

        String senderPhone = authentication.getName();
        String receiverPhone = (String) request.get("receiverPhone");
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String nonce = (String) request.get("nonce");
        Boolean isOffline = (Boolean) request.getOrDefault("isOffline", false);

        Transaction transaction = transactionService
                .sendMoney(senderPhone, receiverPhone, amount, nonce, isOffline);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Money sent successfully");
        response.put("transactionId", transaction.getId());
        response.put("amount", transaction.getAmount());
        response.put("status", transaction.getStatus());
        response.put("nonce", transaction.getNonce());

        return ResponseEntity.ok(response);
    }

    // GET /api/transactions — get history
    @GetMapping
    public ResponseEntity<List<Transaction>> getHistory(
            Authentication authentication) {

        String phone = authentication.getName();
        List<Transaction> history = transactionService.getHistory(phone);
        return ResponseEntity.ok(history);
    }
}