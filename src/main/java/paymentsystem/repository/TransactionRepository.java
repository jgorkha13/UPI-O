package paymentsystem.repository;

import paymentsystem.model.Transaction;
import paymentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    // Calculate total amount spent by user since a given timestamp
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.sender = :user AND t.status = :status AND t.createdAt >= :since")
    BigDecimal getSpentSince(
            @Param("user") User user,
            @Param("status") Transaction.TransactionStatus status,
            @Param("since") LocalDateTime since);

    // Count total payments made by user since a given timestamp
    @Query("SELECT COUNT(t) FROM Transaction t " +
           "WHERE t.sender = :user AND t.status = :status AND t.createdAt >= :since")
    long countSpentSince(
            @Param("user") User user,
            @Param("status") Transaction.TransactionStatus status,
            @Param("since") LocalDateTime since);
}