export type UType = Fraction[]

export interface Fraction {
    id?: String
    slices?: Slices
}

export type Slices = Slice[]

export interface Slice {
    sliceId?: Obj<string, string>
    content?: Obj<string, number>
}

export type Obj<S, T> = ObjPair<S, T>[]

export interface ObjPair<S, T> {
    key?: S
    value?: T
}
