import { Injectable } from '@angular/core';
import { AtomicStitchType, CableNeedleDirection, CableStitch } from '../../model/Chart';

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
}
