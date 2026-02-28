export interface IMindmapObjectData{
    position: {x: number, y: number},
    width: number,
    height: number,
    angle: number,
    text: string,
    style: string
}

export interface IMindmapFile{
    id: string;
    name: string;
    objects: Array<IMindmapObjectData>;
}