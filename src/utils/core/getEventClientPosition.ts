import { isMobile } from './isMobile';
export const getEventClientPosition = (event: any) => {
  let x, y;
  if (!isMobile()) {
    x = (event as MouseEvent).clientX;
    y = (event as MouseEvent).clientY;
  } else {
    x = (event as TouchEvent).touches[0].clientX;
    y = (event as TouchEvent).touches[0].clientY;
  }
  return {
    x,
    y,
  };
};
