### useDragMove

一个封装拖拽元素移动钩子，传入目标`DOM`元素，可以自定义拖拽方向

```tsx
import React, { useRef } from 'react';
import { useDragMove } from 'leaf-react-ui';

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  useDragMove({
    target: ref,
    reset: true,
  });
  return (
    <div
      ref={ref}
      style={{
        width: '200px',
        height: '200px',
        background: '#ccc',
        lineHeight: '200px',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      try drag {}
    </div>
  );
};
```

### options

```ts | pure
export interface DragMoveOptions {
  /** 目标绑定元素 */
  target: RefObject<HTMLElement>;
  /**
   * @description 鼠标抬起或手指抬起是否重置移动距离
   * @default true
   */
  reset?: boolean;
  /** 拖拽移动中触发 */
  onMove?: (moveDiff: { x: number; y: number }, e: TouchEvent | MouseEvent) => void;
  /** 鼠标抬起或手指抬起 */
  onEnd?: (e: TouchEvent | MouseEvent) => void;
  /** 鼠标在目标元素按下或手指按下触发 */
  onStart?: (e: TouchEvent | MouseEvent) => void;
  /**
   * @description 拖拽方向，支持水平，垂直，上下左右，或者任意方向拖拽，默认around，即不限制方向
   * @default around
   */
  moveDirection?: 'horizontal' | 'vertical' | 'around' | 'top' | 'left' | 'right' | 'bottom';
  /** 设置移动阈值, 当达到阈值触发回调 */
  threshold?: number;
  /** 移动中达到阈值触发回调 */
  activeThreshold?: () => void;
  /** 最大移动距离 */
  maxMoveDiff?: number | (() => number);
  /** 达到阈值开启transition，默认拖拽开始会关闭transition，结束时开启transition */
  activeTransition?: boolean;
  /** 设置目标元素的transition */
  transition?: string;
  /** 目标元素如果设置translate，添加此参数传入原始的translateX，translateY */
  originTranslate?: {
    x: number;
    y: number;
  };
  /**
   * @description useEffect依赖数组
   * @default []
   */
  deps?: DependencyList;
  /**
   * @description 当目标ref是一个需要异步加载的组件时，需要的等待时间
   * @default 0
   */
  asyncDelay?: number;
  /**
   * @description 是否自动绑定DOM事件
   * @default true;
   */
  autoBindEvent?: boolean;
}
```

### Result

```ts | pure
export interface DragMoveResult {
  /** 记录当前是否正在拖着中的ref */
  moveIng: MutableRefObject<boolean>;
  /** 记录当前移动的距离 */
  moveDiff: MutableRefObject<{ x: number; y: number }>;
  /** 鼠标按下或者手指按下事件，默认会自动绑定，也可以手动绑定，pc只需要绑定onMouseDown为此回调即可 */
  handleMouseDownOrTouchStart: (e: MouseEvent | TouchEvent) => void;
  /** 鼠标移动或者手指移动事件，pc端默认绑定在window上，不需要手动绑定，移动端可以手动绑定onTouchMove事件 */
  handleMouseMoveOrTouchMove: (e: MouseEvent | TouchEvent) => void;
  /** 鼠标抬起或者手指抬起事件，pc端默认绑定在window上，移动端可以手动绑定到onTouchEnd事件 */
  handleMouseUpOrTouchEnd: (e: MouseEvent | TouchEvent) => void;
  /** 是否在目标元素点击 */
  isClick?: MutableRefObject<boolean>;
}
```
