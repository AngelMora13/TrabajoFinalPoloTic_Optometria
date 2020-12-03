import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token:string="none"
  tiempo:any
  //constructor----------------------
  constructor(private http:HttpClient,private router:Router) {   }

  //funciones------------------------
  login(dni:number,password:string){
    const url:string="http://localhost:8000/api/login/";
    return new Promise((resolve,rejects)=>{
      this.http.post(url,{username:dni,password:password}).toPromise().then(
        datos=>resolve(datos),
        error=>rejects(error)
      )
    });
  }
  
  isAuth(){
    if (localStorage.getItem("authToken")){
      return true
    }else{
      return false
    }
  }
  logoutTime(){
    if(this.isAuth()){
      clearTimeout(this.tiempo)
      this.tiempo=setTimeout(() => {
        alert("Cerrar Sesion por Inactividad")
        this.singout()
      }, 3600000);
    }else{
      this.singout()
    }
    
  }
  singout(){
    clearTimeout(this.tiempo)
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    this.router.navigate(["/login"]);
  }
}
