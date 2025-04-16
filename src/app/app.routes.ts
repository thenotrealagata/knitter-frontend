import { Routes } from '@angular/router';
import { ChartsListingComponent } from './charts/charts-listing/charts-listing.component';
import { ChartEditorComponent } from './charts/chart-editor/chart-editor.component';
import { ChartViewerComponent } from './charts/chart-viewer/chart-viewer.component';
import { UserViewerComponent } from './users/user-viewer/user-viewer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { canDeactivateGuard } from './shared/guards/can-deactivate/can-deactivate.guard';
import { authGuard } from './shared/guards/auth-guard/auth.guard';

// Keep in mind: Angular uses first-match strategy
export const routes: Routes = [
    { path: 'charts/list', component: ChartsListingComponent, },
    { path: 'charts/create', component: ChartEditorComponent, canDeactivate: [canDeactivateGuard], canActivate: [authGuard] },
    { path: 'charts/create/:id', component: ChartEditorComponent },
    { path: 'charts/view/:id', component: ChartViewerComponent },
    { path: 'users/:username', component: UserViewerComponent },
    { path: 'panels/list', component: ChartsListingComponent },
    { path: 'panels/create', component: ChartEditorComponent, canDeactivate: [canDeactivateGuard], canActivate: [authGuard] },
    { path: 'panels/view/:id', component: ChartViewerComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: LoginComponent },
    { path: '404', component: NotFoundComponent},
    { path: '**', redirectTo: '/404' },
];
