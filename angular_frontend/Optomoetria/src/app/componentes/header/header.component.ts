import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/personal.model';
import { LoginService } from 'src/app/servicios/login.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 @Input() user:Usuario;
  constructor(private loginService:LoginService, private usuario:UsuarioService) {     
  this.user=usuario.usuario
  }
  singout(){
    this.loginService.singout()
  }
  ngOnInit(): void {
  }


}
