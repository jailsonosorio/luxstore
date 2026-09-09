package com.luxstore.backend.luxstore_api.address;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.luxstore.backend.luxstore_api.user.User;
import com.luxstore.backend.luxstore_api.user.UserRepository;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/account/address")
@CrossOrigin(origins = "http://localhost:3000")

public class AddressController {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(
            AddressRepository addressRepository,
            UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // LISTAR MORADAS DO UTILIZADOR
    @GetMapping
    @Operation(summary = "Get all addresses for the authenticated user")
    public ResponseEntity<List<Address>> getAddresses(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                addressRepository.findByUser(user));
    }

    // CRIAR NOVA MORADA
    @PostMapping
    @Operation(summary = "Create a new address for the authenticated user")
    public ResponseEntity<Address> createAddress(
            @RequestBody Address address,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        address.setId(null);
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);

        return ResponseEntity.ok(savedAddress);
    }

    // ATUALIZAR MORADA
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing address for the authenticated user")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long id,
            @RequestBody Address addressData,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return addressRepository.findByIdAndUser(id, user)
                .map(address -> {

                    address.setAddress(addressData.getAddress());
                    address.setCity(addressData.getCity());
                    address.setPostalCode(addressData.getPostalCode());
                    address.setCountry(addressData.getCountry());
                    address.setDefault(addressData.isDefault());
                    address.setRecipientName(addressData.getRecipientName());
                    address.setRecipientPhone(addressData.getRecipientPhone());

                    return ResponseEntity.ok(
                            addressRepository.save(address));

                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/default")
    @Operation(summary = "Set an address as the default for the authenticated user")
    public ResponseEntity<Address> setDefaultAddress(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return addressRepository.findByIdAndUser(id, user)
                .map(addressToMakeDefault -> {

                    // Retira o estado principal de todas as moradas
                    List<Address> addresses = addressRepository.findByUser(user);

                    for (Address address : addresses) {
                        address.setDefault(false);
                    }

                    // Define esta como a única principal
                    addressToMakeDefault.setDefault(true);

                    addressRepository.saveAll(addresses);

                    return ResponseEntity.ok(addressToMakeDefault);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ELIMINAR MORADA
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an existing address for the authenticated user")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return addressRepository.findByIdAndUser(id, user)
                .map(address -> {

                    addressRepository.delete(address);

                    return ResponseEntity.noContent().<Void>build();

                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // OBTER UTILIZADOR AUTENTICADO
    private User getAuthenticatedUser(
            Authentication authentication) {

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException(
                        "Utilizador não encontrado"));
    }

}
