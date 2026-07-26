package paymentsystem.config;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

    @Component
    public class JwtUtil {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.expiration}")
        private Long expiration;

        // Create a token for the user
        public String generateToken(String phone) {
            return Jwts.builder()
                    .subject(phone)
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(getSigningKey())
                    .compact();
        }

        // Read phone number from token
        public String extractPhone(String token) {
            return extractClaims(token).getSubject();
        }

        // Check if token is expired
        public boolean isTokenValid(String token) {
            try {
                return !extractClaims(token).getExpiration().before(new Date());
            } catch (Exception e) {
                return false;
            }
        }

        // Open and read the token
        private Claims extractClaims(String token) {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }

        // Convert secret string to a secure key
        private SecretKey getSigningKey() {
            byte[] keyBytes = secret.getBytes();
            return Keys.hmacShaKeyFor(keyBytes);
        }
    }

