package paymentsystem.service;

import paymentsystem.model.User;
import paymentsystem.model.Wallet;
import paymentsystem.repository.UserRepository;
import paymentsystem.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    // Create wallet for new user
    @Transactional
    public Wallet createWallet(User user) {
        if (walletRepository.existsByUser(user)) {
            throw new RuntimeException("Wallet already exists for this user");
        }
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setOfflineLimit(new BigDecimal("2000.00"));
        wallet.setOfflineSpent(BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    // Get wallet by phone number
    @Transactional
    public Wallet getWalletByPhone(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    // Add money to wallet
    @Transactional
    public Wallet addMoney(String phone, BigDecimal amount) {
        Wallet wallet = getWalletByPhone(phone);
        wallet.setBalance(wallet.getBalance().add(amount));
        return walletRepository.save(wallet);
    }
}