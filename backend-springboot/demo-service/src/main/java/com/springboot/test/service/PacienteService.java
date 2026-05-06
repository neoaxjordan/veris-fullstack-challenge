package com.springboot.test.service;

import com.springboot.test.model.Paciente;
import com.springboot.test.repository.PacienteRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
// import java.time.LocalDateTime;
// import java.time.format.DateTimeFormatter;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository repository;

    // Listar todos los que no estén en estado 'I'
    public List<Paciente> listarActivos() {
        return repository.findByEstadoNot("I");
    }

    // Búsqueda optimizada por nombre/apellido
    public List<Paciente> buscarPorNombreOApellido(String term) {
        return repository.findByNombreOApellidoOptimizado(term);
    }

    // Búsqueda por cédula
    public Paciente buscarPorCedula(String cedula) {
        return repository.findByNumeroIdentificacionAndEstadoNot(cedula, "I")
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado o inactivo"));
    }

    // Crear paciente con lógica de nombre completo
    public Paciente guardar(Paciente paciente) {
        paciente.setNombreCompleto(generarNombreCompleto(paciente));
        paciente.setFechaIngreso(new Date());
        paciente.setUsuarioIngreso("SISTEMA");
        return repository.save(paciente);
    }

    // Actualizar paciente
    @Transactional
    public Paciente actualizar(Long id, Paciente datosNuevos) {
        Paciente existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no existe"));
        
        existente.setPrimerNombre(datosNuevos.getPrimerNombre());
        existente.setSegundoNombre(datosNuevos.getSegundoNombre());
        existente.setPrimerApellido(datosNuevos.getPrimerApellido());
        existente.setSegundoApellido(datosNuevos.getSegundoApellido());
        existente.setNombreCompleto(generarNombreCompleto(datosNuevos));
        existente.setEmail(datosNuevos.getEmail());
        
        // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // existente.setFechaModificacion(LocalDateTime.now().format(formatter));
        existente.setFechaModificacion(new Date());

        existente.setUsuarioModificacion("SISTEMA");
        
        return repository.save(existente);
    }

    // Borrado lógico (Tu estándar de oro)
    @Transactional
    public void eliminarLogico(Long id) {
        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no existe"));
        
        paciente.setEstado("I");
        
        // -- DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // -- p.setFechaModificacion(LocalDateTime.now().format(formatter));
        paciente.setFechaModificacion(new Date());
        
        paciente.setUsuarioModificacion("SISTEMA");

        repository.save(paciente);

        // repository.findById(id)
        //         .orElseThrow(() -> new RuntimeException("Paciente no existe"));

        // repository.eliminarLogicoNativo(id, "SISTEMA");
    }

    private String generarNombreCompleto(Paciente p) {
        return (p.getPrimerNombre() + " " + p.getPrimerApellido()).trim().toUpperCase();
    }
}