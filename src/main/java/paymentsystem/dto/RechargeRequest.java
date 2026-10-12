package paymentsystem.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargeRequest {

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
    private String mobileNumber;

    @NotBlank(message = "Operator is required")
    private String operator;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum recharge amount is ₹1")
    private BigDecimal amount;

    private String planName;

    private String nonce;
}
