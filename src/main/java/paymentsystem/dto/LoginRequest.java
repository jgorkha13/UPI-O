//About dto package
//Gatekeepers of incoming api data
////prevenets exposing database entity directly to api

package paymentsystem.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;
}