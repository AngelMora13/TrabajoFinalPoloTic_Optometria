import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelo/personal.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dni:number
  password:string
  tiempo:any
  @ViewChild("mensaje") mensaje:ElementRef;

  //constructor----------------------

  constructor(private loginService:LoginService, private router:Router, 
    private usuario:UsuarioService) { 

  }
  //funciones-----------------------

  singup(){
    this.loginService.login(this.dni,this.password).then(
      (res:Usuario)=>{
        this.usuario.usuario=res
        localStorage.setItem("authToken",res["token"])
        localStorage.setItem("user",JSON.stringify(res))
        this.loginService.logoutTime()
        switch(res["cargo"]){
          case "SECRETARIA":
            this.router.navigate(["turnos"])
            break
          
          case "PROFESIONAL MEDICO":
            this.router.navigate(["pacientes"])        
            break

          case "VENTAS":
            this.router.navigate(["ventas"])    
            break
          
          case "TALLER":
            this.router.navigate(["taller"])
            break
          
          case "GERENCIA":
            this.router.navigate(["gerencia"])
          }
        }
    ).catch(
      error=>{
        if(error["error"]["detail"]){
        clearTimeout(this.tiempo)
        this.mensaje.nativeElement.innerHTML=error["error"]["detail"];
        this.mensaje.nativeElement.classList.add("alert-danger");
        }else{
          clearTimeout(this.tiempo)
          this.mensaje.nativeElement.innerHTML="No hay conexión con el servidor"
          this.mensaje.nativeElement.classList.add("alert-danger");
        }
        this.tiempo=setTimeout(() => {
          this.mensaje.nativeElement.innerHTML=""
          this.mensaje.nativeElement.classList.remove("alert-danger");
        }, 4000);
      }
    );
  }
  ngOnInit(): void {
  }


}
