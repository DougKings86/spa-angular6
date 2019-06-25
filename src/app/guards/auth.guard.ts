import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//import { AuthenticationService } from '../services/index';
import { AutenticacaoService, } from '../services';


declare var page: any;

@Injectable()
export class AuthGuard implements CanActivate {
    

    constructor(
        private _router: Router,
        private _autenticacaoService: AutenticacaoService) 
    {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let roles = route.data["roles"] as string;
        
        if (this._autenticacaoService.isLogado) {
            return true;
        }

        this._router.navigate(['login']);
        return false;
    }


}