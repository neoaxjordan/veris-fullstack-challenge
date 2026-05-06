package com.springboot.test.repository;

import com.springboot.test.model.Paciente;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // 1. Búsqueda por Cédula (Exacta y filtrando los borrados 'I')
    Optional<Paciente> findByNumeroIdentificacionAndEstadoNot(String cedula, String estadoInactivo);

    // 2. Búsqueda por Nombre/Apellido 
    @Query("SELECT p FROM Paciente p WHERE " +
           "(UPPER(p.primerNombre) = UPPER(:term) OR " +
           "UPPER(p.primerApellido) = UPPER(:term) OR " +
           "UPPER(p.nombreCompleto) = UPPER(:term)) " +
           "AND p.estado <> 'I'")
    List<Paciente> findByNombreOApellidoOptimizado(@Param("term") String term);
    
    // 3. Listado general excluyendo borrados
    List<Paciente> findByEstadoNot(String estadoInactivo);

    @Modifying
    @Transactional
    @Query(value = "UPDATE MGM_PACIENTES SET ESTADO = 'I', USUARIO_MODIFICACION = :user, FECHA_MODIFICACION = CURRENT_TIMESTAMP WHERE ID = :id", nativeQuery = true)
    void eliminarLogicoNativo(@Param("id") Long id, @Param("user") String user);
}
