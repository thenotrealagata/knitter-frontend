import { Injectable } from '@angular/core';
import { AtomicStitch, AtomicStitchType, CableNeedleDirection, CableStitch, CompositeStitch, Stitch } from '../../model/Chart';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getCableDescription(cableStitch: CableStitch): string {
    // Name structure: L/C [direction] where L is width of left cable, R is width of right cable
    const stitchNumbers = `${cableStitch.sequence.length - cableStitch.toCableNeedle}/${cableStitch.toCableNeedle}`;

    // Right cross (RC): left cable over right cable
    // Left cross (LC): right cable over left cable
    // RPC/LPC: right purl cable & left purl cable: sequence includes purl stitch
    const includesPurl = cableStitch.sequence.some(stitch => stitch.type === AtomicStitchType.Purl) ? "P" : "";
    const crossDirection = 
      (cableStitch.holdCableNeedle === CableNeedleDirection.HOLD_BEHIND_WORK ? "R" : "L")
      + includesPurl + "C";

    return `${stitchNumbers} ${crossDirection}`;
  }

  isStitch(obj: unknown): obj is Stitch {
    return typeof obj === "object" && obj !== null && 'color' in obj;
  }

  isAtomicStitch(stitch: Stitch): stitch is AtomicStitch {
    return 'type' in stitch && 'color' in stitch;
  }

  isCompositeStitch(stitch: Stitch): stitch is CompositeStitch {
    return 'sequence' in stitch && 'compositeType' in stitch && 'color' in stitch;
  }

  isCableStitch(stitch: Stitch): stitch is CableStitch {
    return this.isCompositeStitch(stitch) && 'toCableNeedle' in stitch && 'holdCableNeedle' in stitch;
  }
}
