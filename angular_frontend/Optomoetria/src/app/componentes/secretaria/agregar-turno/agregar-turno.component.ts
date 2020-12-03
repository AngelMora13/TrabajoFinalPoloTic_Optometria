import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Personal } from 'src/app/modelo/personal.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-agregar-turno',
  templateUrl: './agregar-turno.component.html',
  styleUrls: ['./agregar-turno.component.css']
})
export class AgregarTurnoComponent implements OnInit {
  personalMedico: Personal[] = [];
  turnos: Turnos[] = [];
  pacientes:Paciente[]=[]
  turno:number=0;
  tiempo:any=0;
  dni:number=0;
  personalAsignado:string;
  
  @ViewChild("mensaje") mensaje:ElementRef;
  @ViewChild("turnoForm") turnoForm:NgForm;
  //constructor----------------------------------------
  constructor(private usuario:UsuarioService,private login:LoginService, private router:Router) {
   }
  //funciones------------------------------------------
  getPaciente(dni: number) {
    return this.pacientes.find((e) => {
      return e.dni === dni;
    });
  }

  onNuevoTurno({value,valid}:{value:Turnos,valid:boolean}){
    if(!valid){
      this.tiempo=0
      this.mensaje.nativeElement.innerHTML="Los datos no son validos"
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
      }, 4000);
    }else if(this.dni===0){
      clearTimeout(this.tiempo)
      this.mensaje.nativeElement.innerHTML="el DNI es invalido"
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
    }, 4000);
    }else{
      if(this.pacientes.some(e=>e.dni===this.dni)){
      value.paciente=this.getPaciente(this.dni).id
      value.asistencia=false
      this.usuario.agregarTurnoNuevo(value).then(
        res=>{
          alert("Se agrego el turno satisfactoriamente")
          this.router.navigate(["/turnos"])
        }
      ).catch(
        error=>{
          clearTimeout(this.tiempo)
          this.mensaje.nativeElement.innerHTML=error["error"]["mensaje"];
          this.mensaje.nativeElement.classList.add("alert-danger");
          this.tiempo=setTimeout(() => {
          this.mensaje.nativeElement.innerHTML=""
          this.mensaje.nativeElement.classList.remove("alert-danger");
        }, 4000);
          }
      );
        }else{
          this.tiempo=clearTimeout()
          this.mensaje.nativeElement.innerHTML="el DNI no existe en la lista de pacientes"
          this.mensaje.nativeElement.classList.add("alert-danger");          
        }
    }
}

  ngOnInit(): void {

    //turnos-----------
    this.usuario
    .Turnos()
    .then((res) => {
      this.turnos=Object.values(res)
    })
    .catch((error) => this.login.singout());
    //personal medico------
    this.usuario
    .PersonalMedico()
    .then((res) => {
      this.personalMedico=Object.values(res);
    })
    .catch((error) => this.login.singout());
    //pacientes----------
    this.usuario
    .Pacientes()
    .then((res) => {
      this.pacientes=Object.values(res);
      
    })
    .catch((error) => this.login.singout());

    //otro----------------
    setTimeout(() => {
      if(!this.turnos[0]){
        this.turno=1
      }else{
        for(let turno of this.turnos){
        if(turno.turno>this.turno){
          this.turno=turno.turno
        }
      }
      };
      this.turno+=1;
    }, 500);
    
  }

}
