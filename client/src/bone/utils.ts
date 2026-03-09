/*function getGlobalTransform(el: HTMLElement | null) {
    const result = new DOMMatrix();
    while (el && el !== document.body) {
        const style = getComputedStyle(el);
        if (style.transform){
            const rgx = /(-?[0-9]+(?:\.[0-9]+)?)/gi;
            const transform = style.transform;
            const elMatrix = new DOMMatrix(transform.match(rgx)?.map(it=> Number(it)));
            result.multiplySelf(elMatrix);
        };
        el = el.parentElement;
    }
    return result;
}*/
export function getGlobalTransform2(el: HTMLElement | null) {
    const result = new DOMMatrix();

    while (el && el !== document.body) {
        const style = getComputedStyle(el);

       if (style.transform && style.transform !== "none") {
            const [originXStr, originYStr] = style.transformOrigin.split(' ');
            const originX = parseFloat(originXStr);
            const originY = parseFloat(originYStr);

            const elMatrix = new DOMMatrix(style.transform);

            // Сначала сдвигаем на -origin, потом применяем матрицу, потом возвращаем origin
            const transformWithOrigin = new DOMMatrix()
                .translate(originX, originY)
                .multiply(elMatrix)
                .translate(-originX, -originY);

            result.preMultiplySelf(transformWithOrigin);
        }

        el = el.parentElement;
    }

    return result;
}
export function getGlobalTransform(el: HTMLElement | null) {
    const result = new DOMMatrix();

    while (el && el !== document.body) {
        const style = getComputedStyle(el);

        const origin = style.transformOrigin.split(' ');
        const originX = Number(origin[0].replace('px', ''));
        const originY = Number(origin[1].replace('px', ''));
        if (style.transform && style.transform !== "none") {
            const elMatrix = new DOMMatrix(style.transform);
            result.preMultiplySelf(elMatrix);
        }

        el = el.parentElement;
    }

    return result;
}
/*export function getGlobalTransform(el: HTMLElement | null) {
    const result = new DOMMatrix();

    while (el && el !== document.body) {

        const rect = el.getBoundingClientRect();

        result.preMultiplySelf(
            new DOMMatrix().translate(rect.left, rect.top)
        );

        const style = getComputedStyle(el);

        if (style.transform && style.transform !== "none") {
            const elMatrix = new DOMMatrix(style.transform);
            result.preMultiplySelf(elMatrix);
        }

        el = el.parentElement;
    }

    return result;
}*/
