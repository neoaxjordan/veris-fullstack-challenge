package com.springboot.test.controller;

import com.springboot.test.model.Paciente;
import com.springboot.test.service.PacienteService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping("/all")
    public ResponseEntity<?> listar() {
        List<Paciente> lista = service.listarActivos();
        return responder(200, "Lista de pacientes", lista);
    }

    @GetMapping("/find/{cedula}")
    public ResponseEntity<?> buscarPorCedula(@PathVariable String cedula) {
        try {
            Paciente p = service.buscarPorCedula(cedula);
            return responder(200, "Paciente encontrado", p);
        } catch (Exception e) {
            return responder(404, e.getMessage(), null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String term) {
        List<Paciente> resultados = service.buscarPorNombreOApellido(term);
        return responder(200, "Búsqueda optimizada: " + resultados.size() + " resultados", resultados);
    }

    @PostMapping("/create")
    public ResponseEntity<?> crear(@Valid @RequestBody Paciente paciente) {
        try {
            Paciente nuevo = service.guardar(paciente);
            return responder(201, "Paciente creado con éxito", nuevo);
        } catch (Exception e) {
            return responder(500, "Error al crear: " + e.getMessage(), null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> editar(@Valid @PathVariable Long id, @RequestBody Paciente paciente) {
        try {
            Paciente editado = service.actualizar(id, paciente);
            return responder(200, "Paciente actualizado", editado);
        } catch (Exception e) {
            return responder(404, e.getMessage(), null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            service.eliminarLogico(id);
            return responder(200, "Paciente eliminado (Lógico)", null);
        } catch (Exception e) {
            return responder(404, e.getMessage(), null);
        }
    }

    // Helper para mantener el formato de respuesta
    private ResponseEntity<?> responder(int code, String message, Object data) {
        Map<String, Object> res = new HashMap<>();
        res.put("code", code);
        res.put("message", message);
        res.put("data", data);
        return ResponseEntity.status(code).body(res);
    }
}