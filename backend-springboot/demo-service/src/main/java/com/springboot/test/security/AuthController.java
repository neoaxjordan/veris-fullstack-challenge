package com.springboot.test.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> user) {
        String username = user.get("username");
        String password = user.get("password");

        // Simulación de validación de credenciales
        if ("VERIS".equals(username) && "PRUEBAS123".equals(password)) {
            String token = jwtUtils.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("token", token);
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(401).body("Credenciales inválidas");
    }
}