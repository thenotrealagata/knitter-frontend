import { TestBed } from '@angular/core/testing';
import { ParagraphPipe } from '../../shared/pipes/paragraph.pipe';

describe('ParagraphPipe', () => {
    let pipe: ParagraphPipe;

    const text = "hello world";
    
    beforeEach(() => {
        TestBed.configureTestingModule({ });
        pipe = new ParagraphPipe();
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should truncate text to given length and add ... to end', () => {
        expect(pipe.transform(text, 4)).toBe("hell...");
    });

    it('should trim whitespace', () => {
        expect(pipe.transform(text, 6)).toBe("hello...");
    });

    it('should not change text if limit is above text length', () => {
        expect(pipe.transform(text, 20)).toBe(text);
    });

    it('truncates longer text', () => {
        const text = [...new Array(1000)].map(char => "a").join();
        expect(pipe.transform(text, 120)).toHaveSize(120 + 3);
    });
});