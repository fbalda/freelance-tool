import { MouseEventHandler, PropsWithChildren } from "react";
import { IconType } from "react-icons";

export const PanelHeader = (
  props: PropsWithChildren<{ className?: string }>,
) => {
  return (
    <div className="border-b border-neutral-4 bg-neutral-6 last:border-0">
      <div className={props.className}>{props.children}</div>
    </div>
  );
};

export const PanelBody = (
  props: PropsWithChildren<{ className?: string }>,
) => {
  return (
    <div className={`${props.className} bg-neutral-6`}>{props.children}</div>
  );
};

export const PanelWrapper = (
  props: PropsWithChildren<{ fullWidth?: boolean; className?: string }>,
) => {
  return (
    <section
      className={`mt-4 ${props.fullWidth ? "w-full" : ""} overflow-hidden
        rounded-md border border-neutral-4 bg-neutral-5 shadow-lg ${
        props.className ? props.className : "" }`}
    >
      {props.children}
    </section>
  );
};

export const PanelIconButton = (props: {
  icon: IconType;
  tooltip: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button className="link" title={props.tooltip} onClick={props.onClick}>
      <props.icon size={20} />
    </button>
  );
};
