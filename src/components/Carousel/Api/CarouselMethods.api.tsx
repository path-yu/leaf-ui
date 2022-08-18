export interface CarouselExpose {
  /**  滑动至某一页 */
  to?: (index: number) => void;
  /**  滑动至前一页 */
  prev?: () => void;
  /**  滑动到下一页 */
  next?: () => void;
  /**  获取当前页 */
  getCurrentIndex?: () => number;
}
export default (props: CarouselExpose) => () => {};
