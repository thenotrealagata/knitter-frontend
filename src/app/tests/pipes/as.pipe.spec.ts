import { TestBed } from '@angular/core/testing';
import { AsPipe } from '../../shared/pipes/as.pipe';

describe('AsPipe', () => {
    let pipe: AsPipe;
    
    beforeEach(() => {
        TestBed.configureTestingModule({ });
        pipe = new AsPipe();
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });
});