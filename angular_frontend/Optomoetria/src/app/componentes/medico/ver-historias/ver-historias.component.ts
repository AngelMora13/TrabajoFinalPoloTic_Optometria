import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Historia } from 'src/app/modelo/historia.model';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-ver-historias',
  templateUrl: './ver-historias.component.html',
  styleUrls: ['./ver-historias.component.css']
})
export class VerHistoriasComponent implements OnInit {
  isData:boolean=false;
  dia:boolean=false;
  mes:boolean=false;
  anio:boolean=false;
  quitarFiltro:boolean=false;
  filtro:Historia[]=[];
  pacientes: Paciente[] = [];
  paciente:Paciente
  historias:Historia[]=[];
  paciente_id:number=0;
  id:number;
  @ViewChild("inputDia") inputDia:ElementRef;
  @ViewChild("inputMes") inputMes:ElementRef;
  @ViewChild("inputAnio") inputAnio:ElementRef;
  //constructor----------------------
  constructor(private usuario:UsuarioService, private login:LoginService, private ruta:ActivatedRoute) { }
  //funciones--------------------------
  
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
      this.filtro=this.historias.filter(e=>e.fecha===this.inputDia.nativeElement.value) 
  
    };
    if(this.mes){
      this.filtro=this.historias.filter(e=>e.fecha.split("-")[0]+"-"+e.fecha.split("-")[1]===this.inputMes.nativeElement.value) 

    };
    if(this.anio){
      this.filtro=this.historias.filter(e=>e.fecha.split("-")[0]===this.inputAnio.nativeElement.value.toString()) 

    };
  }
  onQuitarFiltro(){
    this.filtro=this.historias;
    this.dia=false;
    this.mes=false;
    this.anio=false;
    this.quitarFiltro=false;
  }
  getHistorias(){
    this.historias=this.historias.filter(e=>e.paciente===this.id)
    this.filtro=this.historias
  }
  getAll(){

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
    this.getAll();
    this.id =  parseInt(this.ruta.snapshot.params['id']);
    setTimeout(() => {
      this.isData=true;
      this.getHistorias()
      this.paciente=this.getPaciente(this.id);
    }, 500);
  }


}
