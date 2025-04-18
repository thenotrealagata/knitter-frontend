import { TestBed } from '@angular/core/testing';
import { ChartService } from '../../shared/services/chart.service';
import { AtomicStitch, AtomicStitchType, CableNeedleDirection, CableStitch, Color } from '../../shared/model/Chart';

describe('ChartService', () => {
    let service: ChartService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChartService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Test getCableDescription()
    it('getCableDescription for left cross with knit stitches', () => {
        expect(service.getCableDescription(
            new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_BEHIND_WORK)))
            .toBe("1/1 RC");
    })

    it('getCableDescription for right cross with knit stitches', () => {
        expect(service.getCableDescription(
            new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_IN_FRONT_OF_WORK)))
            .toBe("1/1 LC");
    })

    it('getCableDescription for uneven cross', () => {
        expect(service.getCableDescription(
            new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit], 2, CableNeedleDirection.HOLD_IN_FRONT_OF_WORK)))
            .toBe("1/2 LC");
    })

    it('getCableDescription for cable with purl stitches', () => {
        expect(service.getCableDescription(
            new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Purl], 1, CableNeedleDirection.HOLD_BEHIND_WORK)))
            .toBe("1/1 RPC");
    })

    // Test areStitchesEqual()
    it('areStitchesEqual for atomic stitches', () => {
        const knitMC = new AtomicStitch(Color.MC, AtomicStitchType.Knit);
        const noStitch = new AtomicStitch('NO_STITCH', AtomicStitchType.NoStitch);
        expect(service.areStitchesEqual(knitMC, knitMC))
            .toBeTrue();
        expect(service.areStitchesEqual(noStitch, knitMC)).toBeFalse();
    })

    it('areStitchesEqual for cable stitches', () => {
        const twoStitchBehindWork = new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_BEHIND_WORK);
        const twoStitchInFrontOfWork = new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_IN_FRONT_OF_WORK);
        const fourStitch = new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_BEHIND_WORK);
        expect(service.areStitchesEqual(twoStitchBehindWork, twoStitchBehindWork))
            .toBeTrue();
        expect(service.areStitchesEqual(twoStitchBehindWork, twoStitchInFrontOfWork))
            .toBeFalse();
        expect(service.areStitchesEqual(twoStitchBehindWork, fourStitch))
            .toBeFalse();
    })

    it('areStitchesEqual for cable and atomic stitches', () => {
        const knitMC = new AtomicStitch(Color.MC, AtomicStitchType.Knit);
        const cable = new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_BEHIND_WORK);
        expect(service.areStitchesEqual(knitMC, cable)).toBeFalse();
    })

    // Test type assertion functions
    it('isAtomicStitch returns true for atomic stitches', () =>
        expect(service.isAtomicStitch(new AtomicStitch(Color.MC, AtomicStitchType.Knit))).toBeTrue());

    it('isAtomicStitch returns false for composite', () =>
        expect(service.isAtomicStitch(new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_BEHIND_WORK))).toBeFalse()    
        );

    it('isCableStitch returns true for cable', () =>
        expect(service.isCableStitch(new CableStitch(Color.MC, [AtomicStitchType.Knit, AtomicStitchType.Knit], 1, CableNeedleDirection.HOLD_BEHIND_WORK))).toBeTrue()    
        ); 

    it('isCableStitch returns false for atomic', () =>
        expect(service.isCableStitch(new AtomicStitch(Color.MC, AtomicStitchType.K2tog))).toBeFalse()    
        );
});
