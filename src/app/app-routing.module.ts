import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './user/auth.guard';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  //  Makes user module lazy loaded
  {
    path: 'login',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  //  Makes kanban module lazy loaded
  { 
    path: 'kanban', 
    loadChildren: () => 
      import('./kanban/kanban.module').then(m => m.KanbanModule),
    canActivate: [AuthGuard]
 },
//  Makes customers module lazy loaded
 {
   path: 'customers',
   loadChildren: () =>
    import('./customers/customers.module').then(m => m.CustomersModule),
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
