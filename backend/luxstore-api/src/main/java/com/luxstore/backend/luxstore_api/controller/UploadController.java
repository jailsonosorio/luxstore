package com.luxstore.backend.luxstore_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {

     private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads/";

    @PostMapping
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            //String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String fileName = file.getOriginalFilename();
            File destination = new File(UPLOAD_DIR + fileName);

            file.transferTo(destination);

            return ResponseEntity.ok("/uploads/" + fileName);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao fazer upload");
        }
    }
}
