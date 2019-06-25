import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { UsuarioModel, LoginModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class AutenticacaoService {

	private get COOKIE_AUTH(): string { return '_authSis'; }

	get isLogado() { return this._cookieService.check(this.COOKIE_AUTH) }
	get usuario(): UsuarioModel { return this.isLogado ? <UsuarioModel>JSON.parse(atob(this._cookieService.get(this.COOKIE_AUTH))) : null }

	constructor(private _cookieService: CookieService,
				private _httpClient: HttpClient) {

	}

	ObterToken(form: LoginModel) {
		// console.warn('NÃO IMPLEMENTADO -> AutenticacaoSerice.ObterToken()');
		// return this._httpClient.get<UsuarioModel>('../../assets/dados/modelo-login.json', { headers: this.contentHeader() });

		let body = `username=${form.usuario}&password=${form.senha}`;
		let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
		return this._httpClient.post<UsuarioModel>(environment.urlApi + '/login', body, { headers: headers });
	}

	AdicionarSessao(usuario: UsuarioModel) {
		var h = 1;
		this._cookieService.set(this.COOKIE_AUTH, btoa(JSON.stringify(usuario)), new Date(new Date().getTime() + (h*60*60*1000)));
		// this._cookieService.set(this.COOKIE_AUTH, btoa(JSON.stringify(usuario)), new Date(usuario.expires));
	}

	RemoverSessao() {
        this._cookieService.delete(this.COOKIE_AUTH);
    }

	public contentHeader(): HttpHeaders {
		var headers = new HttpHeaders();
        headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return headers;
	}
	
	public contentHeaderToken(): HttpHeaders {
        var headers = new HttpHeaders();
        if (this.isLogado) {
            headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                // 'Authorization': 'Bearer ' + this.usuario.access_token
            });
        }
        return headers;
    }
	

}
