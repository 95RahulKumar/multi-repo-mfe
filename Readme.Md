# Step 1: Create Angular Projects

# Shell

1. ng new shell --no-standalone --routing

# Remotes

ng new products --no-standalone --routing

# Step 2: Install Module Federation Plugin in Both

npm i @angular-architects/module-federation
ng add @angular-architects/module-federation --project shell --port 4200 --type host
ng add @angular-architects/module-federation --project products --port 4201 --type remote

# Step 3: Create a remote feature module

ng g module features/remote --route remote --module app.module.ts

# Step 4: Configure Remote webpack module

Inside remote-repo/webpack.config.js you’ll already have boilerplate.
Update it like this:

```
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const ProductModuleFederationConfigPlugin = withModuleFederationPlugin({

  name: 'products',
  exposes: {
    './ProductsModule': './src/app/products/products.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
```

# Step 4: Configure Remote module

```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RemoteComponent } from './remote.component';

@NgModule({
  declarations: [RemoteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: RemoteComponent }
    ])
  ]
})
export class RemoteModule {}
```

# Step 5: Remote component code

```
import { Component } from '@angular/core';

@Component({
  selector: 'app-remote',
  template: `<h2>🚀 Remote Feature Module Loaded!</h2>`,
})
export class RemoteComponent {}
```

# Step 6:Shell webpack.config.js

```
// projects/host/webpack.config.js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const HostConfigModuleFederationPlugin = withModuleFederationPlugin({

  remotes: {
    "products": "http://localhost:4201/remoteEntry.js",
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
```

# Step 7: loading Remote module

```
// projects/host/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'remote',
    loadChildren: () =>
      import('remote/RemoteModule').then((m) => m.RemoteModule),
  },
];
```
