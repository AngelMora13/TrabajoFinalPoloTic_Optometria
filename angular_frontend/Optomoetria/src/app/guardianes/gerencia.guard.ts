import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Usuario } from '../modelo/personal.model';
import { LoginService } from '../servicios/login.service';

@Injectable({
  providedIn: 'root'
})
export class GerenciaGuard implements CanActivate {
  constructor(private router:Router,private login:LoginService){}
  canActivate(){
    if(!this.login.isAuth()){
      this.login.singout()
      return false
    }else{
      const usuario:Usuario = JSON.parse(localStorage.getItem('user'));
      if(usuario.cargo==="GERENCIA"){
        return true
      }else{
        this.login.singout()
        return false
      }
    }
  }
  
}
