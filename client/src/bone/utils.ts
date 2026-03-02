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
export function getGlobalTransform(el: HTMLElement | null) {
    const result = new DOMMatrix();

    while (el && el !== document.body) {
        const style = getComputedStyle(el);

        if (style.transform && style.transform !== "none") {
            const elMatrix = new DOMMatrix(style.transform);
            result.preMultiplySelf(elMatrix);
        }

        el = el.parentElement;
    }

    return result;
}
