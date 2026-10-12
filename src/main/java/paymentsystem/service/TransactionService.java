package paymentsystem.service;

import paymentsystem.dto.RechargeRequest;
import paymentsystem.model.Transaction;
import paymentsystem.model.User;
import paymentsystem.model.Wallet;
import paymentsystem.repository.TransactionRepository;
import paymentsystem.repository.UserRepository;
import paymentsystem.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private static final String RECHARGE_MERCHANT_PHONE = "0000000000";
    private static final Set<String> OPERATORS = Set.of("Jio", "Airtel", "Vi", "BSNL");

    @Transactional
    public Transaction sendMoney(String senderPhone,
                                 String receiverPhone,
                                 BigDecimal amount,
                                 String nonce,
                                 Boolean isOffline) {

        if (senderPhone.equals(receiverPhone)) {
            throw new RuntimeException("Cannot send money to yourself");
        }

        if (transactionRepository.existsByNonce(nonce)) {
            throw new RuntimeException("Transaction already processed (duplicate nonce)");
        }

        User sender = userRepository.findByPhone(senderPhone)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findByPhone(receiverPhone)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Wallet senderWallet = walletRepository.findByUser(sender)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiverWallet = walletRepository.findByUser(receiver)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (isOffline != null && isOffline) {
            BigDecimal offlineSpent = senderWallet.getOfflineSpent();
            BigDecimal offlineLimit = senderWallet.getOfflineLimit();
            if (offlineSpent.add(amount).compareTo(offlineLimit) > 0) {
                throw new RuntimeException(
                        "Offline spending limit ₹" + offlineLimit + " exceeded");
            }
            senderWallet.setOfflineSpent(offlineSpent.add(amount));
        }

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        if (amount.compareTo(BigDecimal.ONE) < 0) {
            throw new RuntimeException("Minimum transaction amount is ₹1");
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        senderWallet.setLastSyncAt(java.time.LocalDateTime.now());
        walletRepository.save(senderWallet);

        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));
        receiverWallet.setLastSyncAt(java.time.LocalDateTime.now());
        walletRepository.save(receiverWallet);

        Transaction transaction = new Transaction();
        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setAmount(amount);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setType(Transaction.TransactionType.TRANSFER);
        transaction.setNonce(nonce);
        transaction.setIsOffline(isOffline != null && isOffline);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction recharge(String payerPhone, RechargeRequest request) {
        String operator = request.getOperator() == null ? "" : request.getOperator().trim();
        if (!OPERATORS.contains(operator)) {
            throw new RuntimeException("Unsupported operator. Choose Jio, Airtel, Vi, or BSNL");
        }

        BigDecimal amount = request.getAmount();
        if (amount.compareTo(new BigDecimal("9999.00")) > 0) {
            throw new RuntimeException("Maximum recharge amount is ₹9999");
        }

        String nonce = request.getNonce();
        if (nonce == null || nonce.isBlank()) {
            nonce = UUID.randomUUID().toString();
        }
        if (transactionRepository.existsByNonce(nonce)) {
            throw new RuntimeException("Transaction already processed (duplicate nonce)");
        }

        User payer = userRepository.findByPhone(payerPhone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wallet payerWallet = walletRepository.findByUser(payer)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (payerWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        User merchant = getOrCreateRechargeMerchant();
        Wallet merchantWallet = walletRepository.findByUser(merchant)
                .orElseThrow(() -> new RuntimeException("Recharge merchant wallet not found"));

        payerWallet.setBalance(payerWallet.getBalance().subtract(amount));
        payerWallet.setLastSyncAt(java.time.LocalDateTime.now());
        walletRepository.save(payerWallet);

        merchantWallet.setBalance(merchantWallet.getBalance().add(amount));
        merchantWallet.setLastSyncAt(java.time.LocalDateTime.now());
        walletRepository.save(merchantWallet);

        Transaction transaction = new Transaction();
        transaction.setSender(payer);
        transaction.setReceiver(merchant);
        transaction.setAmount(amount);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setType(Transaction.TransactionType.RECHARGE);
        transaction.setOperator(operator);
        transaction.setBeneficiaryPhone(request.getMobileNumber());
        transaction.setPlanName(request.getPlanName());
        transaction.setNonce(nonce);
        transaction.setIsOffline(false);

        return transactionRepository.save(transaction);
    }

    private User getOrCreateRechargeMerchant() {
        User merchant = userRepository.findByPhone(RECHARGE_MERCHANT_PHONE).orElseGet(() -> {
            User created = new User();
            created.setName("Mobile Recharge");
            created.setPhone(RECHARGE_MERCHANT_PHONE);
            created.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            return userRepository.save(created);
        });
        if (!walletRepository.existsByUser(merchant)) {
            Wallet wallet = new Wallet();
            wallet.setUser(merchant);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setOfflineLimit(new BigDecimal("2000.00"));
            wallet.setOfflineSpent(BigDecimal.ZERO);
            walletRepository.save(wallet);
        }
        return merchant;
    }

    // Get transaction history
    public List<Transaction> getHistory(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return transactionRepository
                .findBySenderOrReceiverOrderByCreatedAtDesc(user, user);
    }
}