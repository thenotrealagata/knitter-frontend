import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanDeactivateFn, provideRouter, RouterStateSnapshot } from '@angular/router';

import { canDeactivateGuard } from '../../shared/guards/can-deactivate/can-deactivate.guard';
import { CanDeactivate } from '../../shared/guards/can-deactivate/can-deactivate-interface';
import { ChartEditorComponent } from '../../charts/chart-editor/chart-editor.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../../shared/services/http-interceptor';

describe('CanDeactivateGuard', () => {
  let component: ComponentFixture<CanDeactivate>;

  const executeGuard = (component: CanDeactivate) => 
      TestBed.runInInjectionContext(() => canDeactivateGuard(component, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([ authInterceptor ])),
        provideRouter([])
      ]
    });

    component = TestBed.createComponent(ChartEditorComponent);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if component can deactivate', () => {
    spyOn(component.componentInstance, 'canDeactivate').and.returnValue(true);
    expect(executeGuard(component.componentInstance)).toBeTrue();
  });

  it('should return true if user confirms decision', () => {
    spyOn(component.componentInstance, 'canDeactivate').and.returnValue(false);
    spyOn(window, 'confirm').and.returnValue(true);
    expect(executeGuard(component.componentInstance)).toBeTrue();
  });

  it('should return false if both component and confirm return false', () => {
    spyOn(component.componentInstance, 'canDeactivate').and.returnValue(false);
    spyOn(window, 'confirm').and.returnValue(false);
    expect(executeGuard(component.componentInstance)).toBeFalse();
  });
});