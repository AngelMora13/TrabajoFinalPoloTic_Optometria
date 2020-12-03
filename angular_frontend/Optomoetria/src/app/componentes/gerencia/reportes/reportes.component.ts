import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { cantidadProductos } from 'src/app/modelo/cantidadProducto.model';
import { Historia } from 'src/app/modelo/historia.model';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Pedidos } from 'src/app/modelo/pedido.model';
import { Personal } from 'src/app/modelo/personal.model';
import { cantidadPedidos, Productos } from 'src/app/modelo/producto.model';
import { Turnos } from 'src/app/modelo/turno.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  turnos: Turnos[] = [];
  filtro: Turnos[] = [];
  asistenciaFiltro: Turnos[] = [];
  pacientes: Paciente[] = [];
  personal: Personal[] = [];
  vendedores:Personal[]=[];
  pedidos: Pedidos[] = [];
  filtroPedidos: cantidadPedidos[]=[];
  productos: Productos[] = [];
  historias: Historia[] = [];
  listadoProductos = [];
  isData: boolean = false;
  seleccion: string = '0';
  hoy:Date=new Date()
  //turnos variables
  dia: boolean = false;
  mes: boolean = false;
  quitarFiltro: boolean = false;
  @ViewChild('inputDia') inputDia: ElementRef;
  @ViewChild('inputMes') inputMes: ElementRef;
  @ViewChild('listado') listado: ElementRef;
  //constructor--------------
  constructor(private usuario: UsuarioService, private login: LoginService) {}

  //funciones---------------
  seleccionListado() {
    this.seleccion = this.listado.nativeElement.value;
    switch (this.seleccion) {
      case '1':
        this.filtro=[]
        this.filtro = this.turnos.filter((e) => e.asistencia);
        this.asistenciaFiltro = this.filtro;
        break;
      case '2':
        this.filtro=[]
        this.filtro = this.turnos.filter((e) => !e.asistencia);
        console.log(this.filtro)
        this.asistenciaFiltro = this.filtro;
        break
      case '3':
        this.filtro=[]
        this.pedidos.forEach(e=>{
          this.filtro.push(this.getTurno(e.paciente))
        })
        this.asistenciaFiltro=this.filtro
        break
      case '4':  
      this.filtroPedidos=[] 
      this.productos.forEach(e=>{
        let cantidadPedido:cantidadPedidos={
          id:e.id,
          clasificacion:e.clasificacion,
          nombre:e.nombre,
          alcance:e.alcance,
          armazon:e.armazon,
          lado:e.lado,
          cantidad:0
        }
        this.filtroPedidos.push(cantidadPedido)
      })

      this.filtroPedidos.forEach(e=>{
        this.listadoProductos.forEach(c=>c.forEach((z:cantidadProductos)=>{
          if(z.id===e.id){
            e.cantidad+=z.cantidad
          }
        }))
    })
    this.filtroPedidos.sort((a,b)=>b.cantidad-a.cantidad )
      break
    case "5":
      this.vendedores=this.personal.filter(e=>e.cargo==="VENTAS")
      break
        

    }
  }
  getPaciente(id: number) {
    return this.pacientes.find((e) => {
      return e.id === id;
    });
  }
  getProducto(id: number) {
    return this.productos.find((e) => {
      return e.id === id;
    });
  }
  getPersonal(id: number) {
    return this.personal.find((e) => {
      return e.id === id;
    });
  }
  getVentas(id:number){
    let cantidad:number=0;
    this.pedidos.forEach(e=>{
      if(e.vendedor===id){
        cantidad++
      }
    })
    return cantidad
  }
  getTurno(id:number){
    return this.turnos.find(e=>e.paciente===id)
  }

  onFecha(date: number) {
    if (date === 1) {
      this.dia = true;
      this.mes = false;
    } else if (date === 2) {
      this.dia = false;
      this.mes = true;
    } else if (date === 3) {
      this.dia = false;
      this.mes = false;
    }
  }
  onFiltro() {
    this.quitarFiltro = true;
    if (this.dia) {
      this.filtro = [];
      const semana = new Date(
        this.inputDia.nativeElement.value.replace('-', '/')
      );
      const dia = semana.getDay();
      const numero = semana.getDate();
      let mes = semana.getMonth();
      const año = semana.getFullYear();
      let fecha: string, fechaFinal: Date;
      let nuevoMes:number=parseInt(mes.toString())
      fechaFinal = semana;
      if (dia.toString() === '0') {        
        fechaFinal.setDate(fechaFinal.getDate() + 6); 
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
          
        }
        fecha =
          fechaFinal.getFullYear().toString() +
          '/' +
          (nuevoMes+1).toString() +
          '/' +
          fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= parseInt(mes.toString()) + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) + 1
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) &&
                parseInt(e.fecha.split('-')[2]) - 25 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) ===
              parseInt(mes.toString()) + 1
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) &&
                parseInt(e.fecha.split('-')[2]) <= parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }

      if (dia.toString() === '1') {
        fechaFinal.setDate(fechaFinal.getDate() + 5); 
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
          
        }
        if(numero.toString()==="1"){
          mes--
        }

        fecha =fechaFinal.getFullYear().toString() +'/' +(nuevoMes+1).toString() +'/' +fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                parseInt(numero.toString()) - 1 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 1 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }

      if (dia.toString() === '2') {
        fechaFinal.setDate(fechaFinal.getDate() + 4);
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
        }
        if(numero.toString()==="1" || numero.toString()==="2"){
          mes--
        }

        fecha =fechaFinal.getFullYear().toString() +'/' +(nuevoMes+1).toString() +'/' +fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 2 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 2 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }

      if (dia.toString() === '3') {
        fechaFinal.setDate(fechaFinal.getDate() + 3); 
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
          
        }
        if(numero.toString()==="1" || numero.toString()==="2" || numero.toString()==="3"){
          mes--
        }

        fecha =fechaFinal.getFullYear().toString() +'/' +(nuevoMes+1).toString() +'/' +fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 3 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 3 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }
      if (dia.toString() === '4') {
        fechaFinal.setDate(fechaFinal.getDate() + 2); 
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
          
        }
        if(numero.toString()==="1" || numero.toString()==="2" || numero.toString()==="3" || numero.toString()==="4"){
          mes--
        }

        fecha =fechaFinal.getFullYear().toString() +'/' +(nuevoMes+1).toString() +'/' +fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 4 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 4 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }

      if (dia.toString() === '5') {
        fechaFinal.setDate(fechaFinal.getDate() + 1); 
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
          
        }
        if(numero.toString()==="1" || numero.toString()==="2" || numero.toString()==="3" || numero.toString()==="4" || numero.toString()==="5"){
          mes--
        }

        fecha =fechaFinal.getFullYear().toString() +'/' +(nuevoMes+1).toString() +'/' +fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 5 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 5 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }
      if (dia.toString() === '6') {
        if(parseInt(fechaFinal.getDate().toString())< parseInt(numero.toString())){
          if(parseInt(mes.toString())===11){
            nuevoMes=0
          }else{
            nuevoMes++
          }
          
        }
        if(numero.toString()==="1" || numero.toString()==="2" || numero.toString()==="3" || 
        numero.toString()==="4" || numero.toString()==="5" || numero.toString()==="6"){
          mes--
        }

        fecha =fechaFinal.getFullYear().toString() +'/' +(nuevoMes+1).toString() +'/' +fechaFinal.getDate().toString();
        this.filtro = this.asistenciaFiltro.filter((e) => {
          
          if (parseInt(fecha.split('/')[2]) < parseInt(numero.toString())) {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 5 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          } else {
            if (
              parseInt(e.fecha.split('-')[1]) >= mes + 1 &&
              parseInt(e.fecha.split('-')[1]) <=
              parseInt(fecha.split('/')[1]) 
            ) {
              if (
                parseInt(e.fecha.split('-')[2]) >=
                  parseInt(numero.toString()) - 5 &&
                parseInt(e.fecha.split('-')[2]) - 30 <=
                  parseInt(fecha.split('/')[2])
              ) {
                return true;
              }
            }
          }
          return false;
        });
      }
    }
    if (this.mes) {
      this.filtro = this.asistenciaFiltro.filter(
        (e) =>
          e.fecha.split('-')[0] + '-' + e.fecha.split('-')[1] ===
          this.inputMes.nativeElement.value
      );
    }
  }
  onQuitarFiltro() {
    this.filtro = this.asistenciaFiltro;
    this.dia = false;
    this.mes = false;
    this.quitarFiltro = false;
  }

  getAll() {
    //turnos-----------
    this.usuario
      .Turnos()
      .then((res: Turnos[]) => {
        this.turnos = res;
      })
      .catch((error) => this.login.singout());

    //pacientes--------
    this.usuario
      .Pacientes()
      .then((res: Paciente[]) => (this.pacientes = res))
      .catch((error) => this.login.singout());

    //historias------
    this.usuario
      .Historias()
      .then((res: Historia[]) => (this.historias = res))
      .catch((error) => this.login.singout());

    //personal------
    this.usuario
      .PersonalMedico()
      .then((res: Personal[]) => (this.personal = res))
      .catch((error) => this.login.singout());

    //pedidos------------
    this.usuario
      .Pedidos()
      .then((res: Pedidos[]) => {
        this.pedidos = res.filter(e=>e.fecha.split("-")[1]===(this.hoy.getMonth()+1).toString());
        res.filter(e=>e.fecha.split("-")[1]===(this.hoy.getMonth()+1).toString())
        res.forEach((e) => {
          this.listadoProductos.push(JSON.parse(e.producto));
        });
      })
      .catch((error) => this.login.singout());
    //productos-----------
    this.usuario
      .Productos()
      .then((res: Productos[]) => (this.productos = res))
      .catch((error) => this.login.singout());
  }

  ngOnInit(): void {
    this.getAll();
    setTimeout(() => {
      this.isData = true;
    }, 500);
  }
}
