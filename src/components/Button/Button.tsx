import classNames from "classnames";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode } from "react";

export type ButtonType = "primary" | "default" | "danger" | "link";
export type ButtonSize = "lg" | "sm";

interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  children: ReactNode;
  href?: string;
}
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
 const Button: FC<ButtonProps> = (props) => {
   const { className, btnType, disabled, size, children, href, ...resetProps } =
     props;
   // btn btn-lg btn-primary
   const classes = classNames("btn", className, {
     [`btn-${btnType}`]: btnType,
     [`btn-${size}`]: size,
     disabled: btnType === "link" && disabled,
   });
   if (btnType === "link" && href) {
     return (
       <a href={href} className={classes} {...resetProps}>
         {children}
       </a>
     );
   } else {
     return (
       <button className={classes} disabled={disabled} {...resetProps}>
         {children}
       </button>
     );
   }
 };

Button.defaultProps = {
  disabled: false,
  btnType: "default",
};

export default Button;
