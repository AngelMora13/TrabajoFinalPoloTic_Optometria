import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Historia } from 'src/app/modelo/historia.model';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Pedidos } from 'src/app/modelo/pedido.model';
import { Personal } from 'src/app/modelo/personal.model';
import { Productos } from 'src/app/modelo/producto.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-gerencia',
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.css']
})
export class GerenciaComponent implements OnInit {
  turnos: Turnos[] = [];
  filtro:Turnos[]=[];
  pacientes: Paciente[] = [];
  personal:Personal[]=[]
  pedidos:Pedidos[]=[]
  filtroPedidos:Pedidos[]=[]
  productos:Productos[]=[]
  historias:Historia[]=[];
  listadoProductos=[]
  isData:boolean=false
  seleccion:string="0"
  //turnos variables
  dia:boolean=false;
  mes:boolean=false;
  anio:boolean=false;
  quitarFiltro:boolean=false;
  @ViewChild("inputDia") inputDia:ElementRef;
  @ViewChild("inputMes") inputMes:ElementRef;
  @ViewChild("inputAnio") inputAnio:ElementRef;
  @ViewChild("listado") listado:ElementRef;
  //constructor--------------
  constructor(private usuario:UsuarioService, private login:LoginService) { }

  //funciones---------------
  seleccionListado(){
  return this.seleccion=this.listado.nativeElement.value
  }
  getPaciente(id: number) {
    return this.pacientes.find((e) => {
      return e.id=== id;
    });
  }
  getProducto(id: number) {
    return this.productos.find((e) => {
      return e.id=== id;
    });
  }
  getPersonal(id:number){
    return this.personal.find(e=>{
      return e.id===id;
    })
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

  //personal------
  this.usuario
    .PersonalMedico()
    .then((res:Personal[]) => this.personal=res)
    .catch((error) => this.login.singout());
  
  //pedidos------------
  this.usuario.Pedidos().then(
    (res:Pedidos[])=>{
      this.pedidos=res;
      this.filtroPedidos=res;
      res.forEach(e=>{
        this.listadoProductos.push(JSON.parse(e.producto))
      });
    }
  ).catch((error) => this.login.singout());
  //productos-----------
  this.usuario
  .Productos()
  .then((res:Productos[]) =>this.productos=res)
  .catch((error) => this.login.singout());    
}

  ngOnInit(): void {
    this.getAll()
    setTimeout(() => {
      this.isData=true;
    }, 500);
  }

}
