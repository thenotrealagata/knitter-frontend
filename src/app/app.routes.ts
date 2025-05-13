import { Routes } from '@angular/router';
import { ChartEditorComponent } from './charts/chart-editor/chart-editor.component';
import { canDeactivateGuard } from './shared/guards/can-deactivate/can-deactivate.guard';
import { authGuard } from './shared/guards/auth-guard/auth.guard';

// Keep in mind: Angular uses first-match strategy
export const routes: Routes = [
    { path: '', component: ChartEditorComponent, canDeactivate: [canDeactivateGuard], canActivate: [authGuard] },
    { path: '**', redirectTo: '' },
];
