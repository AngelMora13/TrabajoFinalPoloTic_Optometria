import { Component } from '@angular/core';
import { Usuario } from './modelo/personal.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user:Usuario;
  usuario(){
    return this.user=JSON.parse(localStorage.getItem("user"))
  }
}
