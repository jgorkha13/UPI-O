package paymentsystem.repository;

import paymentsystem.model.Transaction;
import paymentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    // Get all transactions for a user (sent or received)
    List<Transaction> findBySenderOrReceiverOrderByCreatedAtDesc(
            User sender, User receiver);

    // Check if nonce already exists — duplicate prevention
    boolean existsByNonce(String nonce);

    // Find transaction by nonce
    Optional<Transaction> findByNonce(String nonce);
}