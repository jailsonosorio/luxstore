package com.luxstore.backend.luxstore_api.auth;

import com.luxstore.backend.luxstore_api.user.User;
import com.luxstore.backend.luxstore_api.user.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Autenticação", description = "Login e autenticação")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; 

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder 
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar utilizador e gerar token JWT")
    public AuthResponse login(@RequestBody AuthRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));

        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        return new AuthResponse(token, user.getRole(), user.getUsername());
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar novo utilizador")
    public ResponseEntity<?> register(@RequestBody User user) {

        // VALIDAÇÃO BÁSICA
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username já existe");
        }

        // PASSWORD ENCODE
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // DEFAULTS
        user.setProvider("LOCAL");
        user.setRole("USER"); // IMPORTANTE

        userRepository.save(user);

        return ResponseEntity.ok("User criado com sucesso");
    }
}