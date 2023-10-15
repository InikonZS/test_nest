import { IVector } from "./game";
import { Game } from "./game2";
import { BoxCell } from "./items/box";
import { GrassCell } from "./items/grass";
import { SubtiledCell } from "./items/subtiled";

const objectCtors = {
    5: BoxCell,
    13: SubtiledCell,
    10: GrassCell
}

export function createGameObject(game: Game, type: number, pos: IVector){
    const Ctor = objectCtors[type as keyof typeof objectCtors];
    return new Ctor(game, pos);
}