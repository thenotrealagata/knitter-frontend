import { TestBed } from '@angular/core/testing';
import { CurryPipe } from '../../shared/pipes/curry.pipe';

describe('CurryPipe', () => {
    let pipe: CurryPipe;

    const exampleFunction = (str: string) => {
        return str.charAt(0);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({});
        pipe = new CurryPipe();
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should apply arguments', () => {
        expect(pipe.transform(exampleFunction, "hello world")).toBe("h");
    });
});