package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Appointment;
import java.util.List;
import java.util.Optional;

public interface IAppointmentService {
    List<Appointment> getAllAppointments();
    Optional<Appointment> getAppointmentById(Long id);
    Appointment saveAppointment(Appointment appointment);
    Appointment updateAppointment(Long id, Appointment appointmentDetails);
    void deleteAppointment(Long id);
}
