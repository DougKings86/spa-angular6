import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

//plugins
import { CookieService } from 'ngx-cookie-service';
import { SelectModule } from 'ng2-select';
import { ModalModule, BsModalService } from 'ngx-bootstrap';
import {DataTableModule} from "angular2-datatable";

//App
import { AppComponent } from './app.component';
import { RoutingModule } from './app.router';
import { LoginComponent, LembrarSenhaComponent, MultiselectDropdownModule, NavBarComponent } from './components';
import { LoginPageComponent } from './pages';
import { AutenticacaoService, SinistroService, AppService } from './services';
import { SinistrosComponent } from './pages/sinistros/sinistros.component';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LembrarSenhaComponent,
    LoginPageComponent,
    SinistrosComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RoutingModule,
    SelectModule,
    MultiselectDropdownModule,
    ModalModule.forRoot(),
    DataTableModule
  ],
  providers: [
    AppService,
    AuthGuard,
    CookieService,
    AutenticacaoService,
    SinistroService,
    BsModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
