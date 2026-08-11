package paymentsystem.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        System.out.println("=== JWT FILTER ===");
        System.out.println("Request URI: " + request.getRequestURI());
      //  System.out.println("Auth Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
       // System.out.println("Token extracted: " + token.substring(0, Math.min(token.length(), 20)) + "...");

        try {
            final String phone = jwtUtil.extractPhone(token);
            System.out.println("Phone extracted: " + phone);

            boolean isValid = jwtUtil.isTokenValid(token);
            System.out.println("Token valid: " + isValid);

            if (phone != null && isValid &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                phone,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority("ROLE_USER"))
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Authentication set for: " + phone);
            }
        } catch (Exception e) {
            System.out.println("JWT Exception: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}
