package com.example.immoquebec.security.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.internal.Function;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${application.jwt.secretKey}")
    private String jwtSecret;

    @Value("${application.jwt.tokenExpirationAfterMinutes}")
    private int jwtExpirationMinutes;

    public String generateJwtToken(Authentication authentication) {
        byte[] decodedSecret = Base64.getDecoder().decode(jwtSecret);
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(authentication.getName())
                .claim("authorities", authentication.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.from(ZonedDateTime.now().plusMinutes(jwtExpirationMinutes))))
                .signWith(Keys.hmacShaKeyFor(decodedSecret))
                .compact();
    }

    public boolean validateJwtToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("JWT token is invalid: " + e.getMessage());
        }
        return false;
    }

    public Claims getClaims(String token) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("Error parsing JWT token: " + e.getMessage());
            throw e;
        }
    }

    public String getUserNameFromJwtToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getClaims(token);
        return claimsResolver.apply(claims);
    }
}






