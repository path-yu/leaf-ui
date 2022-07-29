import React, {
  MouseEvent,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import './style/image-preview.scss';
import CSSMotion from 'rc-motion';
import classNames from 'classnames';
import { useDragMove } from '../../hook/useDragMove';
import {
  prevIcon,
  nextIcon,
  counterclockwise,
  clockwise,
  originalSize,
  zoomOut,
  zoomIn,
  closeIcon,
} from './ToolBarIcon';
interface ImagePreviewProps {
  previewSrcList: string[];
  showToolBar?: boolean;
}
export interface ImagePreviewExpose {
  setThumbnailEl: (el: HTMLImageElement) => void;
  setPreviewCurrentIndex: (index: number) => void;
  openPreview: () => void;
}
const ImagePreview: ForwardRefRenderFunction<ImagePreviewExpose, ImagePreviewProps> = (
  props,
  ref,
) => {
  let thumbnailEl = useRef<HTMLImageElement>();
  const { previewSrcList, showToolBar = true } = props;
  let maxCurrent = previewSrcList.length - 1;
  const [current, setCurrent] = useState(0);
  const [previewShow, setPreviewShow] = useState(false);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { handleMouseDown } = useDragMove(imageRef, true);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isMount, setIsMount] = useState(false);
  let scaleMap: { [key: string]: { increment: number | null; reduce: number | null } } = {
    1: {
      increment: 1.5,
      reduce: 0.666667,
    },
    0.666667: {
      increment: 1,
      reduce: 0.5,
    },
    0.5: {
      increment: 0.666667,
      reduce: null,
    },
    '1.5': {
      increment: 2.25,
      reduce: 1,
    },
    2.25: {
      increment: 3,
      reduce: 1.5,
    },
    3: {
      increment: null,
      reduce: 2.25,
    },
  };
  const averageRotate = 90;
  const handleZoomOutClick = () => {
    let reduce = scaleMap[scale].reduce;
    if (reduce) {
      setScale(reduce);
    }
  };
  const handleZoomInClick = () => {
    let increment = scaleMap[scale].increment;
    if (increment) {
      setScale(increment);
    }
  };
  const handleNextClick = () => {
    setCurrent(current === maxCurrent ? 0 : current + 1);
  };
  const handlePrevClick = () => {
    setCurrent(current === 0 ? maxCurrent : current - 1);
  };
  useImperativeHandle(ref, () => ({
    ...exposedMethods,
  }));
  useEffect(() => {
    if (isMount) {
      setPreviewShow(true);
    }
  }, [isMount]);
  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    let target = event.target as HTMLElement;
    if (target.classList.contains('image-preview-overlay')) {
      setPreviewShow(false);
    }
  };
  const exposedMethods: ImagePreviewExpose = {
    setThumbnailEl: (el) => {
      thumbnailEl.current = el;
    },
    setPreviewCurrentIndex(index) {
      setCurrent(index);
    },
    openPreview() {
      setIsMount(true);
    },
  };
  const syncTransformOrigin = () => {
    if (!thumbnailEl.current) return;
    const box = thumbnailEl.current!.getBoundingClientRect();
    const previewWrapperRefEle = previewWrapperRef.current;
    const tx = box.left + box.width / 2;
    const ty = box.top + box.height / 2;
    previewWrapperRefEle!.style.transformOrigin = `${tx}px ${ty}px`;
  };
  const resetRotateScale = () => {
    setScale(1);
    setRotate(0);
  };
  const handleLeaveEnd = () => {
    resetRotateScale();
  };
  let commonMotionProps = {
    removeOnLeave: false,
    leavedClassName: 'hidden',
    visible: previewShow,
  };
  return createPortal(
    isMount && (
      <div className="image-preview-container" onClick={handleContainerClick}>
        <CSSMotion
          {...commonMotionProps}
          motionName="fade"
          onLeaveEnd={() => {
            setIsMount(false);
          }}
        >
          {({ className, style }) => (
            <div style={style} className={classNames('image-preview-overlay', className)} />
          )}
        </CSSMotion>
        <CSSMotion
          {...commonMotionProps}
          motionName="fade-in-scale-up"
          onEnterStart={syncTransformOrigin}
          onLeaveStart={syncTransformOrigin}
          onLeaveEnd={handleLeaveEnd}
        >
          {({ className, style }) => (
            <div
              className={classNames('image-preview-wrapper', className)}
              ref={previewWrapperRef}
              style={style}
            >
              <div style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, margin: 'auto' }}>
                <img
                  onMouseDown={handleMouseDown}
                  src={previewSrcList[current]}
                  alt=""
                  ref={imageRef}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          )}
        </CSSMotion>
        {showToolBar && (
          <CSSMotion {...commonMotionProps} motionName="fade">
            {({ className, style }) => (
              <div style={style} className={classNames('image-preview-toolbar', className)}>
                {previewSrcList.length > 1 && (
                  <>
                    <div onClick={handlePrevClick} className="base-icon">
                      {prevIcon}
                    </div>
                    <div onClick={handleNextClick} className="base-icon">
                      {nextIcon}
                    </div>
                  </>
                )}
                <div onClick={() => setRotate(rotate - averageRotate)} className="base-icon">
                  {counterclockwise}
                </div>
                <div onClick={() => setRotate(rotate + averageRotate)} className="base-icon">
                  {clockwise}
                </div>
                <div onClick={() => setScale(1)} className="base-icon">
                  {originalSize}
                </div>
                <div onClick={handleZoomOutClick} className="base-icon">
                  {zoomOut}
                </div>
                <div onClick={handleZoomInClick} className="base-icon">
                  {zoomIn}
                </div>
                <div onClick={() => setPreviewShow(false)} className="base-icon">
                  {closeIcon}
                </div>
              </div>
            )}
          </CSSMotion>
        )}
      </div>
    ),
    document.body,
  );
};
export default forwardRef(ImagePreview);
