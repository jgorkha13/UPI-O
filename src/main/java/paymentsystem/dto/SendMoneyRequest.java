package paymentsystem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SendMoneyRequest {

    @NotBlank(message = "Receiver phone is required")
    private String receiverPhone;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum transaction amount is ₹1")
    private BigDecimal amount;
}