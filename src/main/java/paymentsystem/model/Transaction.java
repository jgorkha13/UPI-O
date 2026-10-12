package paymentsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "txn_type", length = 20)
    private TransactionType type = TransactionType.TRANSFER;

    @Column(length = 32)
    private String operator;

    @Column(length = 15)
    private String beneficiaryPhone;

    @Column(length = 80)
    private String planName;

    @Column(unique = true, nullable = false)
    private String nonce;

    @Column(nullable = false)
    private Boolean isOffline = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime syncedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TransactionStatus {
        PENDING,
        COMPLETED,
        FAILED
    }

    public enum TransactionType {
        TRANSFER,
        RECHARGE
    }
}
