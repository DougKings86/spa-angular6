import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AppService {

  public Bloqueado: EventEmitter<boolean>;

  constructor() { 
    this.Bloqueado = new EventEmitter<boolean>();
  }

  BloquearTela() {
    this.Bloqueado.emit(true);
  }

  DesbloquearTela() {
    this.Bloqueado.emit(false);
  }

}
