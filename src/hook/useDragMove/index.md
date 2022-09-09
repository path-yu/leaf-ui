### useDragMove

一个封装拖拽元素移动钩子，传入目标`DOM`元素，可以自定义拖拽方向

```tsx
import React, { useRef } from 'react';
import { useDragMove } from 'leaf-ui';

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  useDragMove({
    target: ref,
    moveDirection: 'right',
    onMove(diff) {
      console.log(diff.x);
    },
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
      try drag
    </div>
  );
};
```

### slider

借助此 hook，可以实现一个简单的进度条拖拽

```tsx
import React, { useState, CSSProperties, useRef } from 'react';
import { useDragMove } from 'leaf-ui';
export default () => {
  let [progress, setProgress] = useState(0);
  const target = useRef<HTMLDivElement>(null);
  let sliderWidth = 400;
  let containerStyle: CSSProperties = {
    width: sliderWidth + 'px',
    position: 'relative',
    height: '15px',
    background: '#ccc',
    borderRadius: '10px',
  };
  let slideStyle: CSSProperties = {
    width: progress + '%',
    height: '100%',
    background: '#4569d4',
    position: 'absulte',
    display: 'flex',
    justifyContent: 'flex-end',
    borderRadius: '10px 0 0 10px',
  };
  useDragMove({
    target: target,
    moveDirection: 'right',
    reset: false,
    maxMoveDiff: sliderWidth - 23,
    originTranslate: {
      x: -2,
      y: -5,
    },
    onMove(diff) {
      let value = diff.x /  sliderWidth
      setProgress(value * 100);
    },
  });
  return (
    <div style={containerStyle}>
      <div style={slideStyle}></div>
      <div
        ref={target}
        style={{
          position: 'absolute',
          top:0,
          left:0,
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: '#f5f5f5',
          border: '2px solid #4569d4',
          transform: 'translate(0,-20%)',
        }}
      ></div>
    </div>
  );
};
```

### Options

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
  maxMoveDiff?: number;
  /** 达到阈值开启transition，默认拖拽开始会关闭transition，结束时开启transition */
  activeTransition?: boolean;
  /** 设置目标元素的transition */
  transition?: string;
  /** 目标元素如果设置translate，添加此参数传入原始的translateX，translateY */
  originTranslate?: {
    x: number;
    y: number;
  };
}
```

### Result

```ts | pure
export interface DragMoveResult {
  /** 记录当前是否正在拖着中的ref */
  moveIng: MutableRefObject<boolean>;
  /** 记录当前移动的距离 */
  moveDiff: MutableRefObject<{ x: number; y: number }>;
}
```
