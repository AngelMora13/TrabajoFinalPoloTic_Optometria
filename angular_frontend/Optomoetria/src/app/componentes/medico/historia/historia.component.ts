import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Historia } from 'src/app/modelo/historia.model';
import { Paciente } from 'src/app/modelo/paciente.model';
import { Usuario } from 'src/app/modelo/personal.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css']
})
export class HistoriaComponent implements OnInit {
  pacientes: Paciente[] = [];
  paciente:Paciente;
  isData:boolean=false;
  id:number;
  dni:number;
  nombre:string;
  apellido:string;
  contador:number=0;
  tiempo:any=0;
  texto:string;
  
  @ViewChild("historiaForm") historiaForm:NgForm;
  @ViewChild("historia") historia:ElementRef;
  @ViewChild("mensaje") mensaje:ElementRef;
  //constructor-------------------
  constructor(private ruta:ActivatedRoute, private login:LoginService, private usuario:UsuarioService, private router:Router) { }
  //funciones-------------
  onHistoria({value,valid}:{value:Historia,valid:boolean}){
    if(!valid){
      clearTimeout(this.tiempo);
      this.mensaje.nativeElement.innerHTML="Los datos no son validos"
      this.mensaje.nativeElement.classList.add("alert-danger");
      this.tiempo=setTimeout(() => {
        this.mensaje.nativeElement.innerHTML=""
        this.mensaje.nativeElement.classList.remove("alert-danger");
      }, 4000);
    }else{
      value.paciente=this.id
      this.usuario.agregarHistoria(value).then(
        (res)=>{
          alert("Se agrego la historia satisfactoriamente");
          this.router.navigate(["/pacientes"]);
        }
      )
      .catch(
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
      this.historiaForm.resetForm()

    }
  }
  conteo(){    
    this.contador=this.historia.nativeElement.value.length    
  }
  getAll(){
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
  ngOnInit(): void {
    this.getAll();
    this.id =  parseInt(this.ruta.snapshot.params['id']);
    setTimeout(() => {
      this.isData=true;
      this.paciente=this.getPaciente(this.id);
    }, 500);
  }

}
