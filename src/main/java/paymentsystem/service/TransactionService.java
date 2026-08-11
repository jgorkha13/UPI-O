package paymentsystem.service;

import paymentsystem.model.Transaction;
import paymentsystem.model.User;
import paymentsystem.model.Wallet;
import paymentsystem.repository.TransactionRepository;
import paymentsystem.repository.UserRepository;
import paymentsystem.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

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
        transaction.setNonce(nonce);
        transaction.setIsOffline(isOffline != null && isOffline);

        return transactionRepository.save(transaction);
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