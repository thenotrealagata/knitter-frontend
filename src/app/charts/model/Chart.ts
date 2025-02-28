export enum Color {
    MC = "MC",
    CC1 = "CC1",
    CC2 = "CC2",
    CC3 = "CC3",
    CC4 = "CC4",
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

export enum CompositeStitchType {
    Cable = "Cable",
    Wrapped = "Wrapped"
}

export class AtomicStitch implements Stitch {
    color: Color;
    type: AtomicStitchType;

    constructor(color: Color, type: AtomicStitchType) {
        this.color = color;
        this.type = type;
    }
}

export class CompositeStitch implements Stitch {
    compositeType: CompositeStitchType;
    color: Color;
    sequence: AtomicStitch[];

    constructor(compositeType: CompositeStitchType, color: Color, sequence: AtomicStitch[]) {
        this.compositeType = compositeType;
        this.color = color;
        this.sequence = sequence;
    }
}

export enum CableNeedleDirection {
    HOLD_BEHIND_WORK,
    HOLD_IN_FRONT_OF_WORK
}

export class CableStitch extends CompositeStitch {
    toCableNeedle: number;
    holdCableNeedle: CableNeedleDirection;

    constructor(compositeType: CompositeStitchType, color: Color, sequence: AtomicStitch[], toCableNeedle: number, holdCableNeedle: CableNeedleDirection) {
        super(compositeType, color, sequence);
        this.toCableNeedle = toCableNeedle;
        this.holdCableNeedle = holdCableNeedle;
    }
}

export type Chart = {
    title: string;
    description: string;
    width: number;
    height: number;
    isFlat: boolean;
    pattern: Stitch[][];
}