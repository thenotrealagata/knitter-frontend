import { TestBed } from '@angular/core/testing';
import { PatternDescriptionPipe } from '../../shared/pipes/pattern-description.pipe';
import { ChartService } from '../../shared/services/chart.service';
import { AtomicStitch, AtomicStitchType, Color } from '../../shared/model/Chart';

describe('PatternDescriptionPipe', () => {
    let pipe: PatternDescriptionPipe;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ ChartService ]
         });
        pipe = new PatternDescriptionPipe(TestBed.inject(ChartService));
    });

    it('should be created', () => {
        expect(pipe).toBeTruthy();
    });

    it('should create description for one stitch', () => {
        const stitch = new AtomicStitch(Color.MC, AtomicStitchType.Purl);
        expect(pipe.transform(stitch)).toBe("Purl");
    });

    it('should create description for stitch sequence', () => {
        const sequenceTypes = [ AtomicStitchType.Knit, AtomicStitchType.Bobble, AtomicStitchType.K2tog ];
        const sequence = sequenceTypes.map(stitch => new AtomicStitch(Color.MC, stitch));

        expect(pipe.transform(sequence, false)).toBe("With MC Knit 1 Bobble 1 K2tog 1");
    });

    it('should create description for stitch sequence and summarize same type of stitches', () => {
        const sequenceTypes = [ AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.K2tog ];
        const sequence = sequenceTypes.map(stitch => new AtomicStitch(Color.MC, stitch));

        expect(pipe.transform(sequence, false)).toBe("With MC Knit 2 K2tog 1");
    });

    it('should describe colors and notify on color change', () => {
        const sequenceTypes = [ AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.K2tog ];
        const colors = [ Color.CC1, Color.MC, Color.CC1];
        const sequence = sequenceTypes.map((type, i) => new AtomicStitch(colors[i], type));

        expect(pipe.transform(sequence, false)).toBe("With CC1 Knit 1 Switch to MC Knit 1 Switch to CC1 K2tog 1");
    });

    it('should reverse order on right side', () => {
        const sequenceTypes = [ AtomicStitchType.Knit, AtomicStitchType.Bobble, AtomicStitchType.K2tog ];
        const sequence = sequenceTypes.map(stitch => new AtomicStitch(Color.MC, stitch));
        
        expect(pipe.transform(sequence, true)).toBe("With MC K2tog 1 Bobble 1 Knit 1");
    });
});