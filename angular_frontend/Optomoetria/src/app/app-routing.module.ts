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

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  {path:"turnos",component:SecretariaComponent},
  {path:"turnos/:id",component:ModificarTurnoComponent},
  {path:"agregar/turno",component:AgregarTurnoComponent},
  {path:"pacientes/agregar",component:PacienteComponent},
  {path:"pacientes",component:MedicoComponent},
  {path:"paciente/:id",component:HistoriaComponent},
  {path:"paciente/:id/historia",component:VerHistoriasComponent},
  {path:"ventas",component:VentasComponent},
  {path:"ventas/pedidos",component:PedidoComponent},
  {path:"taller",component:TallerComponent},
  {path:"gerencia",component:GerenciaComponent},
  {path:"gerencia/reportes",component:ReportesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
