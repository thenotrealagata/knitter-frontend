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
    Yo = "Yo"
}

export enum CompositeStitchType {
    Cable = "Cable",
    Wrapped = "Wrapped"
}

export class NoStitch implements Stitch {
    color: "NO_STITCH";
    constructor() {
        this.color = "NO_STITCH";
    }
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

    constructor(color: Color, sequence: AtomicStitchType[], toCableNeedle: number, holdCableNeedle: CableNeedleDirection) {
        super(CompositeStitchType.Cable, color, sequence.map(element => new AtomicStitch(color, element)));
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
    parentId?: number;
    colors: Partial<{ [key in Color]: string }>;
    filePath: string;
}