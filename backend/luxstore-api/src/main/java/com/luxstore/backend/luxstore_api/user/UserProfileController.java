package com.luxstore.backend.luxstore_api.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.file.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/profile")
@Tag(name = "User Profile", description = "Endpoints for managing user profile information")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileController(
            UserRepository repository,
            PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @Operation(summary = "Get the profile of the currently authenticated user")
    public User getProfile(Authentication auth) {

        String username = auth.getName();

        return repository.findByUsername(username)
                .orElseThrow();
    }

    @PutMapping
    @Operation(summary = "Update the profile of the currently authenticated user")
    public User updateProfile(
            @RequestBody User updatedUser,
            Authentication auth) {

        String username = auth.getName();

        User user = repository.findByUsername(username)
                .orElseThrow();

        user.setFullName(updatedUser.getFullName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        user.setEmail(updatedUser.getEmail());
        user.setGender(updatedUser.getGender());
        user.setPostalCode(updatedUser.getPostalCode());
        user.setBirthDate(updatedUser.getBirthDate());
        user.setProfileImage(updatedUser.getProfileImage());
        long nextId = repository.count() + 1;
        String memberId = String.format("LUX-%06d", nextId);
        user.setMemberId(memberId);
        return repository.save(user);
    }

    @PostMapping("/upload-photo")
    @Operation(summary = "Upload a profile photo for the currently authenticated user")
    public User uploadProfilePhoto(
            @RequestParam("file") MultipartFile file,
            Authentication auth) throws Exception {

        String username = auth.getName();

        User user = repository.findByUsername(username)
                .orElseThrow();

        // nome único
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads");

        Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);

        user.setProfileImage("/uploads/" + fileName);

        return repository.save(user);
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change the password of the currently authenticated user")
    public String changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication auth) {
        System.out.println("AUTH: " + auth);
        String username = auth.getName();

        User user = repository.findByUsername(username)
                .orElseThrow();

        System.out.println("PASSWORD INPUT: " + request.getCurrentPassword());
        System.out.println("PASSWORD DB: " + user.getPassword());

        boolean matches = passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword());

        System.out.println("MATCHES: " + matches);
        // validar password atual
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password atual incorreta");
        }

        // nova password
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        repository.save(user);

        return "Password alterada com sucesso";
    }
}
