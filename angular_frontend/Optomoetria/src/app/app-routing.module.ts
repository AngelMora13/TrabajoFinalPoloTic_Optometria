import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GerenciaComponent } from './componentes/gerencia/gerencia/gerencia.component';
import { ReportesComponent } from './componentes/gerencia/reportes/reportes.component';
import { LoginComponent } from './componentes/login/login.component';
import { HistoriaComponent } from './componentes/medico/historia/historia.component';
import { MedicoComponent } from './componentes/medico/medico/medico.component';
import { VerHistoriasComponent } from './componentes/medico/ver-historias/ver-historias.component';
import { AgregarTurnoComponent } from './componentes/secretaria/agregar-turno/agregar-turno.component';
import { ModificarTurnoComponent } from './componentes/secretaria/modificar-turno/modificar-turno.component';
import { PacienteComponent } from './componentes/secretaria/paciente/paciente.component';
import { SecretariaComponent } from './componentes/secretaria/secretaria/secretaria.component';
import { TallerComponent } from './componentes/taller/taller/taller.component';
import { PedidoComponent } from './componentes/ventas/pedido/pedido.component';
import { VentasComponent } from './componentes/ventas/ventas/ventas.component';
import { GerenciaGuard } from './guardianes/gerencia.guard';
import { MedicoGuard } from './guardianes/medico.guard';
import { SecretariaGuard } from './guardianes/secretaria.guard';
import { TallerGuard } from './guardianes/taller.guard';
import { VentasGuard } from './guardianes/ventas.guard';

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"turnos",component:SecretariaComponent,canActivate:[SecretariaGuard]},
  {path:"turnos/:id",component:ModificarTurnoComponent,canActivate:[SecretariaGuard]},
  {path:"agregar/turno",component:AgregarTurnoComponent,canActivate:[SecretariaGuard]},
  {path:"pacientes/agregar",component:PacienteComponent,canActivate:[SecretariaGuard]},
  {path:"pacientes",component:MedicoComponent,canActivate:[MedicoGuard]},
  {path:"paciente/:id",component:HistoriaComponent,canActivate:[MedicoGuard]},
  {path:"paciente/:id/historia",component:VerHistoriasComponent,canActivate:[MedicoGuard]},
  {path:"ventas",component:VentasComponent,canActivate:[VentasGuard]},
  {path:"ventas/pedidos",component:PedidoComponent,canActivate:[VentasGuard]},
  {path:"taller",component:TallerComponent,canActivate:[TallerGuard]},
  {path:"gerencia",component:GerenciaComponent,canActivate:[GerenciaGuard]},
  {path:"gerencia/reportes",component:ReportesComponent,canActivate:[GerenciaGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
