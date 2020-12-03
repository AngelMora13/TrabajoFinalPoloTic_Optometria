import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { cantidadProductos } from 'src/app/modelo/cantidadProducto.model';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Pedidos } from 'src/app/modelo/pedido.model';
import { Productos } from 'src/app/modelo/producto.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  productos: Productos[] = [];
  cantidadProducto: cantidadProductos[] = [];
  pacientes: Paciente[] = [];
  isData: boolean = false;
  busqueda: boolean = false;
  pedido: boolean = false;
  realizarVenta: boolean = false;
  contadorProductos: number = 0;
  costoTotal: number = 0;
  dni: number;
  @ViewChild('selectPago') selectPago: ElementRef;

  //constructor-------------------------
  constructor(private usuario: UsuarioService, private login: LoginService) {}
  //funciones----------------------------
  onBuscar() {
    const paciente = this.pacientes.find((e) => e.dni === this.dni);
    if (!paciente) {
      this.busqueda = true;
      this.pedido = false;
      this.realizarVenta = false;
    } else {
      this.busqueda = false;
      this.pedido = true;
      this.realizarVenta = false;
    }
  }
  onAgregarProducto(producto: Productos) {
    const cantidad = parseInt(
      prompt('Cantidad del Producto' + producto.nombre, '1')
    );
    if (isNaN(cantidad)) {
      alert('Debe ingresar solo numeros');
      return;
    } else {
      const nuevoProducto: cantidadProductos = {
        id: producto.id,
        cantidad: cantidad,
      };
      if (this.cantidadProducto.some((e) => e.id === producto.id)) {
        this.cantidadProducto.find(
          (e) => e.id === producto.id
        ).cantidad = cantidad;
        this.costoTotal = 0;
        this.cantidadProducto.forEach(
          (e) => (this.costoTotal += e.cantidad * this.getProducto(e.id).precio)
        );
        return;
      } else {
        this.cantidadProducto.push(nuevoProducto);
        this.costoTotal = 0;
        this.cantidadProducto.forEach(
          (e) => (this.costoTotal += e.cantidad * this.getProducto(e.id).precio)
        );
        this.contadorProductos++;
      }
    }
  }
  onAgregarId() {
    const id = parseInt(prompt('Ingrese el ID del Producto'));
    if (isNaN(id)) {
      alert('Debe ingresar solo numeros');
      return;
    } else if (!this.productos.some((e) => e.id === id)) {
      alert('El producto no Existe');
      return;
    } else {
      const producto = this.productos.find((e) => e.id === id);
      const cantidad = parseInt(
        prompt('Cantidad del Producto' + producto.nombre, '1')
      );
      if (isNaN(cantidad)) {
        alert('Debe ingresar solo numeros');
        return;
      } else {
        const nuevoProducto: cantidadProductos = {
          id: producto.id,
          cantidad: cantidad,
        };
        if (this.cantidadProducto.some((e) => e.id === producto.id)) {
          this.cantidadProducto.find(
            (e) => e.id === producto.id
          ).cantidad = cantidad;
          this.costoTotal = 0;
          this.cantidadProducto.forEach(
            (e) =>
              (this.costoTotal += e.cantidad * this.getProducto(e.id).precio)
          );
          return;
        } else {
          this.cantidadProducto.push(nuevoProducto);
          this.costoTotal = 0;
          this.cantidadProducto.forEach(
            (e) =>
              (this.costoTotal += e.cantidad * this.getProducto(e.id).precio)
          );
          this.contadorProductos++;
        }
      }
    }
  }
  onEliminarId() {
    const id = parseInt(prompt('Ingrese el ID del Producto'));
    if (isNaN(id)) {
      alert('Debe ingresar solo numeros');
      return;
    } else if (!this.cantidadProducto.some((e) => e.id === id)) {
      alert('El producto no esta agregado');
      return;
    } else {
      const producto: cantidadProductos = this.cantidadProducto.find(
        (e) => e.id === id
      );
      this.cantidadProducto.splice(this.cantidadProducto.indexOf(producto), 1);
      this.costoTotal = 0;
      this.cantidadProducto.forEach(
        (e) => (this.costoTotal += e.cantidad * this.getProducto(e.id).precio)
      );
      this.contadorProductos--;
    }
  }
  onFinalizarVenta() {
    if (this.cantidadProducto.length === 0) {
      alert('No se ha generado ninguna Compra');
      return;
    } else if (this.selectPago.nativeElement.value === "0") {
      alert('No ha seleccionado el metodo de Pago');
      return;
    } else {
      const pedido: Pedidos = {
        vendedor: this.usuario.usuario.id,
        paciente: this.getPaciente(this.dni).id,
        producto: JSON.stringify(this.cantidadProducto),
        estado: 'Pendiente',
      };
      this.usuario
        .agregarPedido(pedido)
        .then((res) => {
          alert('Se genero el pedido');
          this.realizarVenta = false;
          this.cantidadProducto = [];
          this.costoTotal = 0;
        })
        .catch((error) => {
          alert(
            'no se pudo generar el pedido, error:' + error['error']['mensaje']
          );
        });
    }
  }
  onPedido() {
    this.busqueda = false;
    this.pedido = false;
    this.realizarVenta = true;
  }
  getAll() {
    //productos-----------
    this.usuario
      .Productos()
      .then((res: Productos[]) => (this.productos = res))
      .catch((error) => this.login.singout());

    //pacientes--------
    this.usuario
      .Pacientes()
      .then((res: Paciente[]) => (this.pacientes = res))
      .catch((error) => this.login.singout());
  }
  getPaciente(dni: number) {
    return this.pacientes.find((e) => {
      return e.dni === dni;
    });
  }
  getProducto(id: number) {
    return this.productos.find((e) => {
      return e.id === id;
    });
  }
  ngOnInit(): void {
    this.getAll();
    setTimeout(() => {
      this.isData = true;
    }, 500);
  }
}
