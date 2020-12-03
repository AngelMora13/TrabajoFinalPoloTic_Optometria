import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Usuario } from 'src/app/modelo/personal.model';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  @ViewChild("mensaje") mensaje:ElementRef;
  @ViewChild("pacienteForm") pacienteForm:NgForm
  tiempo:any=0;
  paciente:Paciente={
    apellido:"",
    dni:0,
    nombre:"",
    telefono:0,
  }
  //constructor---------------------
  constructor(private usuario:UsuarioService, private router:Router) { }

  //funciones--------------------

  onGuardar({value,valid}:{value:Paciente,valid:boolean}){
    if(!valid){
      clearTimeout(this.tiempo);
      this.mensaje.nativeElement.innerHTML="Los datos no son validos"
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
      }, 4000);
      
      
  }else if(this.paciente.dni===0){
    clearTimeout(this.tiempo);
      this.mensaje.nativeElement.innerHTML="el DNI es invalido"
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
      }, 4000);
  }else{
    
    this.usuario.agregarPaciente(value).then(
      res=>{
        alert("Se agrego el paciente satisfactoriamente")
        this.router.navigate(["/turnos"])
      }
      ).catch(
        error=>{
        clearTimeout(this.tiempo);
        this.mensaje.nativeElement.innerHTML=error["error"]["mensaje"];
        this.mensaje.nativeElement.classList.add("alert-danger");
        this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
      }, 4000);
        }
      )

    this.pacienteForm.resetForm()
  }
}
  ngOnInit(): void {
  }

}
