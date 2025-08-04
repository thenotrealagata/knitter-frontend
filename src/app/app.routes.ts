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
    { path: 'panels/create', component: ChartEditorComponent },
    { path: '**', redirectTo: '/panels/create' },
    //{ path: '/', component: ChartEditorComponent, canDeactivate: [canDeactivateGuard], canActivate: [authGuard] },
    //{ path: '**', component: ChartEditorComponent, canDeactivate: [canDeactivateGuard], canActivate: [authGuard] },
];
