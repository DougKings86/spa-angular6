import {RouterModule, Routes} from '@angular/router';

import { LoginPageComponent, SinistrosComponent } from './pages';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: '', component: SinistrosComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginPageComponent },
    // { path: 'sinistros', component: SinistrosComponent },
    // // handling 404
    // {
    // path: '**', component: Error404PageComponent
    // }
  ];
  
  export const RoutingModule = RouterModule.forRoot(routes, { useHash: true });
  