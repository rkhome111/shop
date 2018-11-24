import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleInfoComponent } from './sale-info/sale-info.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuardService],
    component: SaleInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

