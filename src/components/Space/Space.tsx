import React, { CSSProperties, FC, ReactNode, Children } from 'react';
import gapMaps from './_common';
import { createKey, delpx, getGap } from '../../utils';
import { ensureSupportFlexGap } from './utils';

export interface SpaceProps {
  /**
   * @description 垂直排列方式
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /**
   * @description 是否为行内元素
   */
  inline?: boolean;
  /**
   * @description 是否垂直布局
   */
  vertical?: boolean;
  /**
   * @description 是否超出换行
   */
  wrap?: boolean;
  /**
   * @description 水平排列方式
   */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  /**
   * @description 为数字时，是水平和垂直间距；为数组时，是 [水平间距, 垂直间距]
   */
  size?: 'small' | 'medium' | 'large' | number | [number, number];
  /**
   * @description 是否存在包裹子元素的容器，false 值只会对支持 flex gap 的浏览器生效
   */
  wrapItem?: boolean;
  /**
   * @description 节点样式，当 wrap-item 为 true 时有效
   */
  itemStyle?: CSSProperties;
  children?: ReactNode;
}

const Space: FC<SpaceProps> = (props) => {
  const { align, inline, vertical, wrap, justify, size, wrapItem, itemStyle, children } = props;
  if (!children) return null;
  const computedMargin: () => { horizontal: number; vertical: number } = () => {
    if (Array.isArray(size)) {
      return {
        horizontal: size[0],
        vertical: size[1],
      };
    }
    if (typeof size === 'number') {
      return {
        horizontal: size,
        vertical: size,
      };
    }
    const gap = gapMaps[createKey('gap', size!)];
    const { row, col } = getGap(gap);
    return {
      horizontal: delpx(row),
      vertical: delpx(col),
    };
  };
  let margin = computedMargin();
  const horizontalMargin = `${margin.horizontal}px`;
  const semiHorizontalMargin = `${margin.horizontal / 2}px`;
  const verticalMargin = `${margin.vertical}px`;
  const semiVerticalMargin = `${margin.vertical / 2}px`;
  const lastIndex = Children.count(children) - 1;
  const isJustifySpace = justify!.startsWith('space-');
  const useGap = ensureSupportFlexGap();
  const style: CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: vertical ? 'column' : 'row',
    justifyContent: ['start', 'end'].includes(justify!) ? 'flex-' + justify : justify,
    flexWrap: wrap || vertical ? 'wrap' : 'nowrap',
    alignItems: align,
    marginTop: useGap || vertical ? '' : `-${semiVerticalMargin}`,
    marginBottom: useGap || vertical ? '' : `-${semiVerticalMargin}`,
    gap: useGap ? `${margin.vertical}px ${margin.horizontal}px` : '',
  };
  let childNode: ReactNode;
  if (!wrapItem) {
    childNode = children!;
  } else {
    childNode = Children.map(children, (child, index) => {
      if (useGap) {
        return (
          <div role="none" style={{ maxWidth: '100%', ...itemStyle }}>
            {child}
          </div>
        );
      }
      let wrapStyle: CSSProperties = {};
      if (vertical) {
        wrapStyle.marginBottom = index !== lastIndex ? verticalMargin : '';
      } else {
        wrapStyle = {
          marginLeft: isJustifySpace
            ? justify === 'space-between' && index === lastIndex
              ? ''
              : semiHorizontalMargin
            : index !== lastIndex
            ? horizontalMargin
            : '',
          marginRight: isJustifySpace
            ? justify === 'space-between' && index === 0
              ? ''
              : semiHorizontalMargin
            : '',
          paddingTop: semiVerticalMargin,
          paddingBottom: semiVerticalMargin,
        };
      }
      return <div style={{ maxWidth: '100%', ...itemStyle, ...wrapStyle }}>{child}</div>;
    });
  }
  return (
    <div role="none" style={style}>
      {childNode}
    </div>
  );
};
Space.defaultProps = {
  inline: false,
  wrapItem: true,
  justify: 'start',
  align: 'start',
  size: 'medium',
  vertical: false,
  wrap: true,
  itemStyle: {},
};
export default Space;
