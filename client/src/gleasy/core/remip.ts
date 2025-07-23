export const remip = (image: HTMLImageElement, tiles: number, tileSize: number)=>{
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth * 2;
    canvas.height = image.naturalHeight * 2;//new OffscreenCanvas(image.naturalWidth * 2, image.naturalHeight * 2);
    const context = canvas.getContext('2d');
    context.fillStyle = '#f00';
    context.fillRect(0,0, canvas.width, canvas.height);
    for (let y=0; y<tiles; y++){
        for (let x=0; x<tiles; x++){
            for (let oy = 0; oy < 3; oy++){
               for (let ox = 0; ox < 3; ox++){
                const xsc = [0, 1, 3][ox];
                const xsi = [2, 1, 2][ox];
                const xdi = [0.5, 0, 0][ox];
                const ysc = [0, 1, 3][oy];
                const ysi = [2, 1, 2][oy];
                const ydi = [0.5, 0, 0][oy];
                    context?.drawImage(image, 
                        (x + xdi)*tileSize, (y + ydi) * tileSize, tileSize / xsi, tileSize / ysi, 
                        (x)*tileSize*2 + xsc * tileSize/2, (y)* tileSize*2 + ysc *tileSize/2, tileSize / xsi, tileSize / ysi
                    );
                }
            }
        }
    }
        console.log(canvas.toDataURL());
    return canvas;
}