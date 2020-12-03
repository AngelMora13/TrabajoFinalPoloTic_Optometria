import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Pedidos } from 'src/app/modelo/pedido.model';
import { Productos } from 'src/app/modelo/producto.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedidos:Pedidos[]=[]
  filtroPedidos:Pedidos[]=[]
  productos:Productos[]=[]
  pacientes:Paciente[]=[]
  listadoProductos=[]
  id:number
  isData:boolean=false;
  busqueda:boolean=false;
  //constructor---------------
  constructor(private usuario:UsuarioService, private login:LoginService, private router:Router) { }
  //funciones-----------------
  onBuscar(){
    if(!this.pedidos.some(e=>e.id===this.id)){
      this.busqueda=true;
      return;
    }
    
  this.busqueda=false;
    this.filtroPedidos=this.pedidos
    this.filtroPedidos=this.pedidos.filter(e=>e.id===this.id)
  }
  onModificar(pedido:Pedidos){
    const estado=parseInt(prompt("ingrese el valor del estado\n 1)Pedido \n 2)Taller"),0)
    if(estado===1){
      pedido.estado="Pedido";
      return this.onGuardarPedido(pedido);
    }else if(estado===2){
      pedido.estado="Taller";      
      return this.onGuardarPedido(pedido);
    }else{
      alert("Debe ingresar un numero valido")
    }
  }
  onGuardarPedido(pedido:Pedidos){
    this.usuario.agregarPedido(pedido)
    .then((res) => {
      alert('Se genero el pedido');
      this.router.navigate(["/ventas"])
    })
    .catch((error) => {
      alert(
        'no se pudo generar el pedido, error:' + error['error']['mensaje']
      );
      pedido.estado="Pendiente"
    });
  }
  getAll(){
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
  
  //pacientes--------
  this.usuario
    .Pacientes()
    .then((res:Paciente[]) => this.pacientes=res)
    .catch((error) => this.login.singout());
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
  ngOnInit(): void {
    this.getAll()
    setTimeout(() => {
      this.isData=true;
    }, 500);
  }

}
