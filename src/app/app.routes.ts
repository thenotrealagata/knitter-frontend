import { Routes } from '@angular/router';
import { ChartsListingComponent } from './charts/charts-listing/charts-listing.component';
import { ChartEditorComponent } from './charts/chart-editor/chart-editor.component';
import { ChartViewerComponent } from './charts/chart-viewer/chart-viewer.component';
import { UserViewerComponent } from './users/user-viewer/user-viewer.component';
import { PanelsListingComponent } from './panels/panels-listing/panels-listing.component';

// Keep in mind: Angular uses first-match strategy
export const routes: Routes = [
    { path: 'charts/list', component: ChartsListingComponent, },
    { path: 'charts/create', component: ChartEditorComponent },
    { path: 'charts/create/:id', component: ChartEditorComponent },
    { path: 'charts/view/:id', component: ChartViewerComponent },
    { path: 'users/:username', component: UserViewerComponent },
    { path: 'panels/list', component: PanelsListingComponent },
    { path: 'panels/create', component: ChartEditorComponent }, // TODO separate panel create component?
];
