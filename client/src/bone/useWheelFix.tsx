import { useEffect } from "react";

function canScrollX(el: HTMLElement | null, deltaX: number) {
  if (!el) return false;

  const { scrollLeft, scrollWidth, clientWidth } = el;

  if (scrollWidth <= clientWidth) return false;

  if (deltaX < 0) {
    // свайп влево
    return scrollLeft > 0;
  } else {
    // свайп вправо
    return scrollLeft < scrollWidth - clientWidth;
  }
}

function findScrollableX(el: HTMLElement | null) {
  while (el && el !== document.body) {
    const style = getComputedStyle(el);
    if (style.overflowX !== "visible") return el;
    el = el.parentElement;
  }
  return null;
}

const wheelHandler = (e: WheelEvent) => {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
  const scrollable = e.target instanceof HTMLElement ? findScrollableX(e.target): false;

  if (!(scrollable && canScrollX(scrollable, e.deltaX))) {
    e.preventDefault();
  }
}


export const useWheelFix = ()=>{
    useEffect(()=>{
        window.addEventListener("wheel", wheelHandler, { passive: false });
        return ()=>{
            window.removeEventListener("wheel", wheelHandler);
        }
    }, [])
}