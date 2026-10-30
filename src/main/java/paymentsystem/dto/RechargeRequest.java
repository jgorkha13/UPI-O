package paymentsystem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargeRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
    private String mobileNumber;

    @NotBlank(message = "Operator is required")
    @Size(max = 32, message = "Operator name is too long")
    private String operator;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum recharge amount is ₹1")
    private BigDecimal amount;

    // Bug fix: constrain planName to match the DB column length (80 chars)
    @Size(max = 80, message = "Plan name must not exceed 80 characters")
    private String planName;

    private String nonce;
}
