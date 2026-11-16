package paymentsystem.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, message = "Name must be at least 2 characters")
    private String name;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
            message = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    )
    private String password;
}