import React, { CSSProperties, FC } from 'react';
import { ThemeProps } from '../Icon/icon';
export interface ProgressProps {
  /** 当前进度值  */
  percent: number;
  /** 进度条的高度 */
  strokeHeight?: number;
  /** 是否显示进度值 */
  showText?: boolean;
  /** 自定义的Style */
  styles?: CSSProperties;
  /** 进度条的主题 */
  theme?: Omit<ThemeProps, 'light'>;
}
const Progress: FC<ProgressProps> = (props) => {
  const { percent, strokeHeight, showText, styles, theme } = props;
  return (
    <div className="simple-progress-bar" style={styles}>
      <div
        className="simple-progress-bar-outer"
        style={{ height: `${strokeHeight}px` }}
      >
        <div
          className={`simple-progress-bar-inner color-${theme}`}
          style={{ width: `${percent}%` }}
        >
          {showText && <span className="inner-text">{`${percent}%`}</span>}
        </div>
      </div>
    </div>
  );
};

Progress.defaultProps = {
  strokeHeight: 15,
  showText: true,
  theme: 'primary',
};
export default Progress;
