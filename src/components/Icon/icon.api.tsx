import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export interface IconProps {
  /** 支持框架主题 根据主题显示不同的颜色 */
  theme?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'light'
    | 'dark';
  /**
   * react-fontawesome库props配置项 更新配置项请查看react-fontawesome文档
   */
  resetProps?: FontAwesomeIconProps;
}
export default (props: IconProps) => {};
