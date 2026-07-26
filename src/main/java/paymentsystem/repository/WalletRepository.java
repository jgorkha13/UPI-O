package paymentsystem.repository;

import paymentsystem.model.Wallet;
import paymentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    // Find wallet by user
    Optional<Wallet> findByUser(User user);

    // Check if wallet exists for user
    boolean existsByUser(User user);
}