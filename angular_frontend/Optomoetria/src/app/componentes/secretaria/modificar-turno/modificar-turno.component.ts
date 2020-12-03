import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Personal } from 'src/app/modelo/personal.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-modificar-turno',
  templateUrl: './modificar-turno.component.html',
  styleUrls: ['./modificar-turno.component.css'],
})
export class ModificarTurnoComponent implements OnInit {
  personalMedico: Personal[] = [];
  turnos: Turnos
  pacientes: Paciente[] = [];
  turno: number = 0;
  tiempo: any = 0;
  personalAsignado: number;
  id: number;
  isData:boolean=false

  @ViewChild('mensaje') mensaje: ElementRef;
  @ViewChild('turnoForm') turnoForm: NgForm;
  //constructor----------------------------------------
  constructor(
    private usuario: UsuarioService,
    private login: LoginService,
    private router: Router,
    private ruta: ActivatedRoute
  ) {}
  //funciones------------------------------------------
  getPaciente(id: number) {
    return this.pacientes.find((e) => {
      return e.id === id;
    });
  }
  onModificarTurno({value,valid}:{value:Turnos,valid:boolean}){
    if(!valid){
      clearTimeout(this.tiempo);
      this.mensaje.nativeElement.innerHTML="Los datos no son validos"
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
      }, 4000);
    }else if(this.getPaciente(this.turnos.paciente).dni===0){
      clearTimeout(this.tiempo)
      this.mensaje.nativeElement.innerHTML="el DNI es invalido";
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML="";
        this.mensaje.nativeElement.classList.remove("alert-danger");
    }, 4000);
    }else{
      if(this.pacientes.some(e=>e.dni===this.getPaciente(this.turnos.paciente).dni)){
      value.paciente=this.getPaciente(this.turnos.paciente).id;
      value.asistencia=false;
      value.id=this.id;
      this.usuario.agregarTurnoNuevo(value).then(
        res=>{
          alert("Se modifico el turno satisfactoriamente");
          this.router.navigate(["/turnos"]);
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

  getAll(){
    //turnos-----------
    this.usuario
      .Turnos()
      .then((res: Turnos[]) => (this.turnos = res.find(e=>e.id===this.id)))
      .catch((error) => this.login.singout());
    //personal medico------
    this.usuario
      .PersonalMedico()
      .then((res: Personal[]) => (this.personalMedico = res))
      .catch((error) => this.login.singout());
    //pacientes----------
    this.usuario
      .Pacientes()
      .then((res: Paciente[]) => (this.pacientes = res))
      .catch((error) => this.login.singout());
  }
  ngOnInit(): void {
    this.getAll()
    this.id =  parseInt(this.ruta.snapshot.params['id']);
    setTimeout(() => {
      this.turno=this.turnos.turno;
      this.isData=true;
    }, 500);
    
    
  }
}
