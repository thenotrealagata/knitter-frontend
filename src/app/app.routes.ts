import { Routes } from '@angular/router';
import { ChartsListingComponent } from './charts/charts-listing/charts-listing.component';
import { ChartEditorComponent } from './charts/chart-editor/chart-editor.component';
import { ChartViewerComponent } from './charts/chart-viewer/chart-viewer.component';

// Keep in mind: Angular uses first-match strategy
export const routes: Routes = [
    { path: 'charts/list', component: ChartsListingComponent },
    { path: 'charts/create', component: ChartEditorComponent },
    { path: 'charts/edit/:id', component: ChartEditorComponent },
    { path: 'charts/view/:id', component: ChartViewerComponent },
];
