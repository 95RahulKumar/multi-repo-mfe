import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path:'products', 
    loadChildren:() => 
        loadRemoteModule({
          type: 'module',
          remoteEntry: 'http://localhost:4201/remoteEntry.js',
          exposedModule: './ProductsModule'
        })
        .then((m) => m.ProductsModule)
        .catch((err: any) => {
          console.error('Error loading remote module:', err);
        })
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
