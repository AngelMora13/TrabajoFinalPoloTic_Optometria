import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Historia } from '../modelo/historia.model';
import { Paciente } from '../modelo/paciente.model';
import { Pedidos } from '../modelo/pedido.model';
import { Usuario } from '../modelo/personal.model';
import { Turnos } from '../modelo/turno.model';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario: Usuario;

  constructor(private http: HttpClient, private login: LoginService) {
    this.usuario = JSON.parse(localStorage.getItem('user'));
  }
  Turnos() {
    const token: string = localStorage.getItem('authToken');
    if (
      this.usuario.cargo === 'SECRETARIA' ||
      this.usuario.cargo === 'PROFESIONAL MEDICO' ||
      this.usuario.cargo === 'GERENCIA'
    ) {
      const url: string = 'http://localhost:8000/api/turnos/';
      return new Promise((resolve, rejects) => {
        this.http
          .get(url, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }
  Pacientes() {
    const token: string = localStorage.getItem('authToken');
    if (
      this.usuario.cargo === 'SECRETARIA' ||
      this.usuario.cargo === 'PROFESIONAL MEDICO' ||
      this.usuario.cargo === 'VENTAS' ||
      this.usuario.cargo === 'TALLER' ||
      this.usuario.cargo === 'GERENCIA'
    ) {
      const url: string = 'http://localhost:8000/api/pacientes/';
      return new Promise((resolve, rejects) => {
        this.http
          .get(url, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  PersonalMedico() {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'SECRETARIA' ||
        this.usuario.cargo === 'GERENCIA'
    ) {
      const url: string = 'http://localhost:8000/api/personal/';
      return new Promise((resolve, rejects) => {
        this.http
          .get(url, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  Historias() {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'PROFESIONAL MEDICO' ||
    this.usuario.cargo === 'GERENCIA') {
      const url: string = 'http://localhost:8000/api/historias/';
      return new Promise((resolve, rejects) => {
        this.http
          .get(url, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  Productos() {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'VENTAS' || this.usuario.cargo === 'TALLER' ||
    this.usuario.cargo === 'GERENCIA') {
      const url: string = 'http://localhost:8000/api/productos/';
      return new Promise((resolve, rejects) => {
        this.http
          .get(url, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  Pedidos() {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'VENTAS' || this.usuario.cargo === 'TALLER' ||
    this.usuario.cargo === 'GERENCIA') {
      const url: string = 'http://localhost:8000/api/pedidos/';
      return new Promise((resolve, rejects) => {
        this.http
          .get(url, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  Asistencia(turno: Turnos) {
    const token: string = localStorage.getItem('authToken');
    turno.asistencia = true;
    if (this.usuario.cargo === 'SECRETARIA') {
      const url: string = 'http://localhost:8000/api/turnos/';
      return new Promise((resolve, rejects) => {
        this.http
          .post(url, turno, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }
  agregarPaciente(paciente: Paciente) {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'SECRETARIA') {
      const url: string = 'http://localhost:8000/api/pacientes/';
      return new Promise((resolve, rejects) => {
        this.http
          .post(url, paciente, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  agregarTurnoNuevo(turno: Turnos) {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'SECRETARIA') {
      const url: string = 'http://localhost:8000/api/turnos/';
      return new Promise((resolve, rejects) => {
        this.http
          .post(url, turno, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  agregarHistoria(historia: Historia) {
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'PROFESIONAL MEDICO') {
      const url: string = 'http://localhost:8000/api/historias/';
      return new Promise((resolve, rejects) => {
        this.http
          .post(url, historia, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }
  }

  agregarPedido(pedido:Pedidos){
    const token: string = localStorage.getItem('authToken');
    if (this.usuario.cargo === 'VENTAS' || this.usuario.cargo === 'TALLER') {
      const url: string = 'http://localhost:8000/api/pedidos/';
      return new Promise((resolve, rejects) => {
        this.http
          .post(url, pedido, { headers: { authorization: token } })
          .toPromise()
          .then(
            (datos) => resolve(datos),
            (error) => rejects(error)
          );
      });
    }

  }
}
