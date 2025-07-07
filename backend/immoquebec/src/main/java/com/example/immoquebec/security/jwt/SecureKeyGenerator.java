package com.example.immoquebec.security.jwt;

import java.security.SecureRandom;
import java.util.Base64;

public class SecureKeyGenerator {
    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[32]; // 256 bits are equal to 32 bytes
        random.nextBytes(keyBytes);
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        System.out.println("Secure JWT Key: " + base64Key);
    }
}
