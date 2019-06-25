import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AutenticacaoService, AppService } from '../../../services/index';

// declare var page;

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	notificarErro: string = null;
	formLogin: FormGroup;

	get usuario() { return this._autenticacaoService.usuario; }

	constructor(private _formBuilder: FormBuilder,
				private _autenticacaoService: AutenticacaoService,
				private _router: Router,
				private _appService: AppService) {

		// page = this;
	}

	ngOnInit() {
		this.formLogin = this._formBuilder.group({
			usuario: new FormControl('', [Validators.required]),
			senha: new FormControl('', [Validators.required])
		});
	}

	Logar() {
		this.notificarErro = null;
		if (this.formLogin.valid) {
			this._appService.BloquearTela();
			this._autenticacaoService.ObterToken(this.formLogin.value)
				.subscribe(ret => {
					if (ret.message.toLowerCase() == "ok") {
						this._autenticacaoService.AdicionarSessao(ret);
						this._router.navigate(['/']);
					}
				},
				error => console.error(error),
				() => {
					this._appService.DesbloquearTela();
				});
		}
		else {
			this.notificarErro = "Preencha todos os campos obrigatórios.";
		}
	}

}
