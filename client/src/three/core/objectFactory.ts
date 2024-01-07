import { IVector } from "./game";
import { Game } from "./game2";
import { BoxCell } from "./items/box";
import { GrassCell } from "./items/grass";
import { SubtiledCell } from "./items/subtiled";
import { WaterCell } from "./items/water";
import { SandCell } from "./items/sand";

const objectCtors = {
    5: BoxCell,
    13: SubtiledCell,
    10: GrassCell,
    17: WaterCell,
    18: SandCell,
}

export function createGameObject(game: Game, type: number, pos: IVector){
    const Ctor = objectCtors[type as keyof typeof objectCtors];
    return new Ctor(game, pos);
}
