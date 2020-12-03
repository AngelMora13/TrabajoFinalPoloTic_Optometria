import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Historia } from 'src/app/modelo/historia.model';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  isData:boolean=false;
  dia:boolean=false;
  mes:boolean=false;
  anio:boolean=false;
  quitarFiltro:boolean=false;
  busqueda:boolean=false;
  sinAsistencia:boolean=false;
  sinHistoria:boolean=false;
  observaciones:boolean=false;
  turnos: Turnos[] = [];
  filtro:Turnos[]=[];
  pacientes: Paciente[] = [];
  historias:Historia[]=[];
  dni:number;
  paciente_id:number=0;
  @ViewChild("inputDia") inputDia:ElementRef;
  @ViewChild("inputMes") inputMes:ElementRef;
  @ViewChild("inputAnio") inputAnio:ElementRef;

  //constructor---------------------
  constructor(private usuario:UsuarioService, private login:LoginService) { }
  //funciones-----------------------
  onVerHistoria(){

  }
  onBuscar(){
    const paciente=this.pacientes.find(e=>e.dni===this.dni)
    if(!paciente){
      this.busqueda=true;
      this.sinHistoria=false;
      this.observaciones=false;
      this.sinAsistencia=false
    }else{
      if(!this.turnos.find(e=>e.paciente===paciente.id)){
        this.busqueda=true;
        this.sinHistoria=false;
        this.observaciones=false;
        this.sinAsistencia=false
      }else{
        if(!this.turnos.find(e=>e.paciente===paciente.id && e.asistencia)){
          this.sinAsistencia=true
          this.busqueda=false;
          this.sinHistoria=false;
          this.observaciones=false;
        }else{
          if(!this.historias.find(e=>e.paciente===paciente.id)){  
            this.paciente_id=paciente.id        
            this.sinHistoria=true;
            this.busqueda=false;
            this.observaciones=false;
            this.sinAsistencia=false
          }else{
            this.paciente_id=paciente.id 
            this.observaciones=true;
            this.sinHistoria=false;
            this.busqueda=false;
            this.sinAsistencia=false
        }
      }
      }
    }
  }
  onFecha(date:number){
    if(date===1){
      this.dia=true;
      this.mes=false;
      this.anio=false;
    }else if(date===2){
      this.dia=false;
      this.mes=true;
      this.anio=false;
    }else if(date===3){
      this.dia=false;
      this.mes=false;
      this.anio=true;
    }
    
  }
  onFiltro(){
    this.quitarFiltro=true;
    if(this.dia){
      this.filtro=this.turnos.filter(e=>e.fecha===this.inputDia.nativeElement.value) 
  
    };
    if(this.mes){
      this.filtro=this.turnos.filter(e=>e.fecha.split("-")[0]+"-"+e.fecha.split("-")[1]===this.inputMes.nativeElement.value) 

    };
    if(this.anio){
      this.filtro=this.turnos.filter(e=>e.fecha.split("-")[0]===this.inputAnio.nativeElement.value.toString()) 

    };
  }
  onQuitarFiltro(){
    this.filtro=this.turnos;
    this.dia=false;
    this.mes=false;
    this.anio=false;
    this.quitarFiltro=false;
  }
  getAll(){
    //turnos-----------
    this.usuario
    .Turnos()
    .then((res:Turnos[]) => {
      this.turnos=res
      this.filtro=res
    })
    .catch((error) => this.login.singout());
  
  //pacientes--------
  this.usuario
    .Pacientes()
    .then((res:Paciente[]) => this.pacientes=res)
    .catch((error) => this.login.singout());   
  
  //historias------
  this.usuario.Historias()
  .then((res:Historia[])=> this.historias=res )
  .catch(error=> this.login.singout())
}
  
  getPaciente(id: number) {
    return this.pacientes.find((e) => {
      return e.id=== id;
    });
  }
  ngOnInit(): void {
    this.getAll()
    setTimeout(() => {
      this.isData=true;
    }, 500);
  }

}
