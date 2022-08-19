import React, { CSSProperties, FC, PropsWithChildren, ReactNode, UIEvent, useState } from 'react';
import { throttle } from '../../utils/core/throttle';

export interface InfiniteScrollProps {
  /**
   * @description 触发加载的距离阈值，单位为px
   * @default 0
   */
  thresholdDistance?: number;
  /**
   * @description 触底加载方法
   */
  load: (effectFn: (noMore: boolean) => void) => void;
  /**
   * @description 滚动容器高度 单位px
   */
  height?: string;
  /**
   * @description 容器扩展样式
   */
  style?: CSSProperties;
  /**
   * @description 是否禁用底部加载占位
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 加载中占位
   */
  loadingPlaceHolder?: ReactNode;
  /**
   * @description 加载到底部没有更多数据占位
   */
  noMorePlaceHolder?: ReactNode;
}
const InfiniteScroll: FC<InfiniteScrollProps & PropsWithChildren> = (props) => {
  const {
    children,
    thresholdDistance = 0,
    load,
    height = '300px',
    style = {},
    disabled = false,
    loadingPlaceHolder,
    noMorePlaceHolder,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const containerStyle: CSSProperties = {
    height,
    overflowY: 'scroll',
    ...style,
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (isLoading || noMore) return;
    let target = event.currentTarget as HTMLElement;
    let reachBottomHeight = target.scrollHeight - target.scrollTop - target.offsetHeight;
    if (reachBottomHeight <= thresholdDistance) {
      setIsLoading(true);
      load((noMore) => {
        setNoMore(noMore);
        setIsLoading(false);
      });
    }
  };

  const footerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#5e6d82',
    lineHeight: '1.5em',
    fontSize: '14px',
  };
  const showLoading = !disabled && isLoading && !noMore;
  const showNoMore = !disabled && noMore;
  return (
    <div onScroll={handleScroll} style={containerStyle}>
      {children}
      {showLoading &&
        (loadingPlaceHolder ? loadingPlaceHolder : <p style={footerStyle}>加载中..</p>)}
      {showNoMore &&
        (noMorePlaceHolder ? noMorePlaceHolder : <p style={footerStyle}>没有更多了</p>)}
    </div>
  );
};

export default InfiniteScroll;
