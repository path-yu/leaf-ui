import { ReactNode, SyntheticEvent } from 'react';
import { BaseButtonProps } from '../../Button/Button.api';

export interface ImageProps {
  /**
   * @description 图片说明
   */
  alt?: string;
  /**
   * @description 图片加载失败时显示的地址
   */
  fallbackSrc?: string;
  /**
   * @description 图片高度
   */
  height?: string | number;
  /**
   * @description 图片宽度
   */
  width?: string | number;
  /**
   * @description 图片地址
   */
  src: string;
  /**
   * @description 是否开启懒加载,基于intersectionObserver配置进入视口开始加载
   */
  lazy?: boolean;
  /**
   * @description lazy=true 时 intersection observer 观测的配置
   */
  intersectionObserverOptions?: IntersectionObserverInit;
  /**
   * @description 图片在容器内的的适应类型
   */
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  /**
   * @description 预览图片地址
   */
  previewSrc?: string;
  /**
   * @description 是否可以点击图片进行预览
   */
  previewDisabled?: boolean;
  /**
   * @description 图片放大后是否展示底部工具栏
   */
  showToolbar?: boolean;
  /**
   * @description 图片加载完成执行的回调
   */
  onLoad?: (e: SyntheticEvent) => void;
  /**
   * @description 图片加载失败回调
   */
  onError?: (e: SyntheticEvent) => void;
  /**
   * @description 图像没有加载成功时候的占位
   */
  placeHolder: ReactNode;
}
export default (props: ImageProps) => {};
