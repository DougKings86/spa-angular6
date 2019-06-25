import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { UsuarioModel } from '../../models';
import { AutenticacaoService } from '../../services';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    public _autenticacaoService: AutenticacaoService, 
    private _router: Router
  ) {
    }

  ngOnInit() {
    
  }

  RemoverSessao() {
    this._autenticacaoService.RemoverSessao();
    this._router.navigate(['login']);
  }

}


