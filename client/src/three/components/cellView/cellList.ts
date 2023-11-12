import { GameObject } from "../../core/items/gameObject";
import { RocketView } from "./items/rocket";
import { DiscoView } from "./items/disco";
import { BombView } from "./items/bomb";
import { HeliView } from "./items/heli";
import { CellView } from "./items/cell";
import { BoxView } from "./items/box";
import { GrassView } from "./items/grass";
import { SubtiledView } from "./items/subtiled";

export const cellList: Record<string, (props: {cell: GameObject})=>React.JSX.Element> = {
    '1': CellView,
    '2': CellView,
    '3': CellView,
    '4': CellView,
    '5': BoxView,
    '7': RocketView,
    '8': BombView,
    '9': DiscoView,
    '10': GrassView,
    '11': GrassView,
    '12': HeliView,
    '13': SubtiledView
}