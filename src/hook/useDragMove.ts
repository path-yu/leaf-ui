import { MouseEvent as ReactMouseEvent, RefObject, useEffect, useRef } from 'react';

// 拖着元素的钩子
export function useDragMove(ref: RefObject<HTMLElement>, reset = false) {
  let isClick = useRef(false);
  let touchPosition = useRef({ x: 0, y: 0 });
  let moveDiff = useRef({ x: 0, y: 0 });
  let originTransition = useRef<string | null>(null);
  const handleMouseDown = (e: ReactMouseEvent<HTMLElement>) => {
    isClick.current = true;
    touchPosition.current = { x: e.clientX, y: e.clientY };
    originTransition.current = ref.current!.style.transition;
    ref.current!.style.transition = 'none';
  };
  useEffect(() => {
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  const handleMouseMove = (e: MouseEvent) => {
    if (!isClick.current) return;
    const { clientX, clientY } = e;
    moveDiff.current.x += clientX - touchPosition.current.x;
    moveDiff.current.y += clientY - touchPosition.current.y;
    moveEle();
    touchPosition.current = { x: clientX, y: clientY }; //更新上一次鼠标移动后的x和y坐标
  };
  const handleMouseUp = () => {
    if (!isClick.current) {
      return;
    }
    isClick.current = false; //鼠标抬起后赋值为false
    ref.current && (ref.current!.style.transition = originTransition.current!);
    if (reset) {
      resetRef();
    }
  };
  const resetRef = () => {
    moveDiff.current = { x: 0, y: 0 };
    touchPosition.current = { x: 0, y: 0 };
    moveEle();
  };
  // 鼠标离开浏览器窗口
  const handleMouseOut = (evt: any) => {
    if (!evt) {
      evt = window.event;
    }
    let to = evt!.relatedTarget || evt!.toElement;
    if (!to || to.nodeName === 'HTML') {
      isClick.current = false;
      ref.current && (ref.current!.style.transition = originTransition.current!);
      resetRef();
    }
  };
  const moveEle = () => {
    let ele = ref.current as HTMLElement;
    if (!ele) return;
    ele.style.transform = `translate(${moveDiff.current.x}px,${moveDiff.current.y}px)`;
  };
  return {
    handleMouseDown,
  };
}
