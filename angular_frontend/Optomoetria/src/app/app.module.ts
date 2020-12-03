import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http'

import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { SecretariaComponent } from './componentes/secretaria/secretaria/secretaria.component';
import { PacienteComponent } from './componentes/secretaria/paciente/paciente.component';
import { AgregarTurnoComponent } from './componentes/secretaria/agregar-turno/agregar-turno.component';
import { ModificarTurnoComponent } from './componentes/secretaria/modificar-turno/modificar-turno.component';
import { MedicoComponent } from './componentes/medico/medico/medico.component';
import { HistoriaComponent } from './componentes/medico/historia/historia.component';
import { VerHistoriasComponent } from './componentes/medico/ver-historias/ver-historias.component';
import { VentasComponent } from './componentes/ventas/ventas/ventas.component';
import { PedidoComponent } from './componentes/ventas/pedido/pedido.component';
import { TallerComponent } from './componentes/taller/taller/taller.component';
import { GerenciaComponent } from './componentes/gerencia/gerencia/gerencia.component';
import { ReportesComponent } from './componentes/gerencia/reportes/reportes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SecretariaComponent,
    PacienteComponent,
    AgregarTurnoComponent,
    ModificarTurnoComponent,
    MedicoComponent,
    HistoriaComponent,
    VerHistoriasComponent,
    VentasComponent,
    PedidoComponent,
    TallerComponent,
    GerenciaComponent,
    ReportesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
