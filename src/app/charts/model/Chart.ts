export enum Color {
    MC,
    CC1,
    CC2,
    CC3,
    CC4,
    CC5
}

export interface Stitch {
    color: Color;
}

export enum AtomicStitchType {
    Knit = "Knit",
    Purl = "Purl",
    K2tog = "K2tog",
    P2tog = "P2tog",
    Yo = "Yo",
    Ktbl = "Ktbl",
}

export class AtomicStitch implements Stitch {
    color: Color;
    type: AtomicStitchType;

    constructor(color: Color, type: AtomicStitchType) {
        this.color = color;
        this.type = type;
    }
}

export interface CompositeStitch extends Stitch {
    sequence: AtomicStitch[];
}

export enum CableNeedleDirection {
    HOLD_BEHIND_WORK,
    HOLD_IN_FRONT_OF_WORK
}

export class CableStitch implements CompositeStitch {
    color: Color;
    sequence: AtomicStitch[];
    toCableNeedle: number;
    holdCableNeedle: CableNeedleDirection;

    constructor(color: Color, sequence: AtomicStitch[], toCableNeedle: number, holdCableNeedle: CableNeedleDirection) {
        this.color = color;
        this.sequence = sequence;
        this.toCableNeedle = toCableNeedle;
        this.holdCableNeedle = holdCableNeedle;
    }
}

export class WrappedStitch implements CompositeStitch {
    color: Color;
    sequence: AtomicStitch[];

    constructor(color: Color, sequence: AtomicStitch[]) {
        this.color = color;
        this.sequence = sequence;
    }
}

export type Chart = {
    pattern: Stitch[][];
}