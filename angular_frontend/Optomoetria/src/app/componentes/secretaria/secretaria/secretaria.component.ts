import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Personal } from 'src/app/modelo/personal.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-secretaria',
  templateUrl: './secretaria.component.html',
  styleUrls: ['./secretaria.component.css'],
})
export class SecretariaComponent implements OnInit {
  dni: number;
  turnos: Turnos[] = [];
  pacientes: Paciente[] = [];
  personalMedico: Personal[] = [];
  buscar:boolean=false;
  nuevoPaciente:boolean=false;
  nuevoTurno:boolean=false;
  asistencia:boolean=false;
  modificarTurno:number;
  tiempo:any=0
  isData:boolean=false
  hoy = new Date
  @ViewChild("mensaje") mensaje:ElementRef;

  //constructor-----------------------------
  constructor(private usuario: UsuarioService, private login: LoginService, private router:Router) {

  }

  //funciones--------------------------------
  getAll(){
        //turnos-----------
        this.usuario
        .Turnos()
        .then((res:Turnos[]) => {
          this.turnos=res.filter(e=>e.fecha.split("-")[2]===this.hoy.getDate().toString())
        })
        .catch((error) => this.login.singout());
      
      //pacientes--------
      this.usuario
        .Pacientes()
        .then((res:Paciente[]) => this.pacientes=res)
        .catch((error) => this.login.singout());
  
      //personal medico------
      this.usuario
        .PersonalMedico()
        .then((res:Personal[]) => this.personalMedico=res)
        .catch((error) => this.login.singout());
        
  }

  getPaciente(id: number) {
    return this.pacientes.find((e) => {
      return e.id=== id;
    });
  }
  getPersonal(id: number) {
    return this.personalMedico.find((e) => {
      return e.id === id;
    });
  }

  onTurno(){
    const paciente=this.pacientes.find(e=>e.dni===this.dni)
    if(!paciente){
      this.nuevoPaciente=true
      this.nuevoTurno=false;
      this.buscar=false;
      return
    }
    if(this.turnos.some(e=>e.paciente===paciente.id && !e.asistencia)){
      this.buscar=true;
      this.modificarTurno=this.turnos.find(e=>(e.paciente===paciente.id && !e.asistencia)).id
      this.nuevoTurno=false;
      this.nuevoPaciente=false
        return this.turnos.find(e=>e.paciente===paciente.id && !e.asistencia)
    }else{
      this.nuevoTurno=true;
      this.nuevoPaciente=false
      this.buscar=false;
    }
  }

  onAsistencia(){
    const turno=this.turnos.find(e=>e.id===this.modificarTurno)
    this.buscar=false
    this.usuario.Asistencia(turno).then(
    res=>{
      this.asistencia=true
      this.mensaje.nativeElement.innerHTML="Se ha cambiado la asistencia satisfactoriamente";
      this.tiempo=setTimeout(() => {
        this.asistencia=false
      }, 4000);
    }
    ).catch(
      error=>{
        this.buscar=false
        this.asistencia=true
        clearTimeout(this.tiempo);
        this.mensaje.nativeElement.innerHTML=error["error"]["mensaje"];
        this.mensaje.nativeElement.classList.remove("bg-success");
        this.mensaje.nativeElement.classList.add("bg-danger");
        this.tiempo=setTimeout(() => {
          this.asistencia=false
          this.mensaje.nativeElement.innerHTML="Se ha cambiado la asistencia satisfactoriamente";
          this.mensaje.nativeElement.classList.remove("bg-danger");
          this.mensaje.nativeElement.classList.add("bg-success");
        }, 4000);
      }
    )
    
    
  }

  ngOnInit(): void {
    this.getAll()
    setTimeout(() => {
      this.isData=true;
    }, 500);
    
  }
}
