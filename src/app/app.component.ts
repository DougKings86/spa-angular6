import { Component } from '@angular/core';
import { AppService } from './services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  bloqueado: boolean = false;

  constructor(private _appService: AppService) {
    this._appService.Bloqueado
        .subscribe(bloquear => this.bloqueado = bloquear);
  }
}
