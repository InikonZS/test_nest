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

import { IBoneNode } from "./boneModel";

export const getCurrentTransform = (activeObject: IBoneNode, refMap: any) => {
        //    console.log(activeObject)
            const objectData = activeObject;
            const ref = {current: refMap.current[objectData?.name]};
        if (!objectData || !objectData.keyframes || !objectData.keyframes.length) {
            return {
                translate: { x: objectData.position.x, y: objectData.position.y },
                rotate: 0,
                scale: { x: 1, y: 1 }
            }
        }
        const transformTRS = {
            translate: { x: 0, y: 0 },
            rotate: 0,
            scale: { x: 1, y: 1 }
        }
        if (!ref.current) {
            return transformTRS;
        }
        const transforms = ref.current.computedStyleMap().get('transform');
        if (transforms instanceof CSSTransformValue) {
            let trs = '';

            transforms.forEach((value) => {
                if (value instanceof CSSTranslate) {
                    trs = trs + 't';
                    transformTRS.translate.x = value.x.to('px').value;
                    transformTRS.translate.y = value.y.to('px').value;
                }
                if (value instanceof CSSRotate) {
                    trs = trs + 'r';
                    transformTRS.rotate = value.angle.to('deg').value;
                }
                if (value instanceof CSSScale) {
                    trs = trs + 's';
                    transformTRS.scale.x = Number(value.x);
                    transformTRS.scale.y = Number(value.y);
                }
            });
            if (!['trs', 'rs', 'ts', 'tr', 't', 'r', 's'].includes(trs)) {
                console.log('unsupported transform, readed partially');
            }
            return transformTRS;
        }
    }

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
