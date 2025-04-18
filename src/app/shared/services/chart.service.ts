import { Injectable } from '@angular/core';
import { AtomicStitch, AtomicStitchType, CableNeedleDirection, CableStitch, CompositeStitch, Stitch } from '../model/Chart';

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
    const includesPurl = cableStitch.sequence.some(stitch => stitch === AtomicStitchType.Purl) ? "P" : "";
    const crossDirection = 
      (cableStitch.holdCableNeedle === CableNeedleDirection.HOLD_BEHIND_WORK ? "R" : "L")
      + includesPurl + "C";

    return `${stitchNumbers} ${crossDirection}`;
  }

  areStitchesEqual(stitch1: Stitch, stitch2: Stitch) {
    return (this.isAtomicStitch(stitch1) && this.isAtomicStitch(stitch2) && stitch1.type === stitch2.type)
    || (this.isCableStitch(stitch1) && this.isCableStitch(stitch2)
      && stitch1.holdCableNeedle === stitch2.holdCableNeedle
      && stitch1.toCableNeedle === stitch2.toCableNeedle
      && stitch1.sequence.length === stitch2.sequence.length
      && stitch1.sequence.every((stitch, i) => stitch2.sequence[i] === stitch))
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
