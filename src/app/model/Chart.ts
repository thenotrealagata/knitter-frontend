export enum Color {
    MC = "MC",
    CC1 = "CC1",
    CC2 = "CC2",
    CC3 = "CC3",
    CC4 = "CC4",
}

export interface Stitch {
    color: Color | "NO_STITCH";
}

export enum AtomicStitchType {
    Knit = "Knit",
    Purl = "Purl",
    K2tog = "K2tog",
    P2tog = "P2tog",
    Yo = "Yo",
    SSK = "SSK",
    SSPK = "SSPK",
    Slip = "Slip",
    KFB = "KFB",
    Bobble = "Bobble",
    NoStitch = "NoStitch"
}

export enum CompositeStitchType {
    Cable = "Cable",
    Wrapped = "Wrapped"
}

export class AtomicStitch implements Stitch {
    color: Color | "NO_STITCH";
    type: AtomicStitchType;

    constructor(color: Color | "NO_STITCH", type: AtomicStitchType) {
        this.color = color;
        this.type = type;
    }
}

export class CompositeStitch implements Stitch {
    compositeType: CompositeStitchType;
    color: Color;
    sequence: AtomicStitchType[];

    constructor(compositeType: CompositeStitchType, color: Color, sequence: AtomicStitchType[]) {
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

    constructor(color: Color, sequence: AtomicStitchType[], toCableNeedle: number, holdCableNeedle: CableNeedleDirection) {
        super(CompositeStitchType.Cable, color, sequence);
        this.toCableNeedle = toCableNeedle;
        this.holdCableNeedle = holdCableNeedle;
    }
}

export type Chart = {
    id?: number;
    title: string;
    description: string;
    width: number;
    height: number;
    flat: boolean;
    pattern: Stitch[][];
    createdAt?: string;
    userId?: number;
    parentId?: number;
    colors: Partial<{ [key in Color]: string }>;
    filePath: string;
}

export type Panel = Chart & {
    charts: Chart[];
}