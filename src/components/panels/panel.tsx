import { MouseEventHandler, PropsWithChildren } from "react";
import { IconType } from "react-icons";

// export const PanelHeader = (
//   props: PropsWithChildren<{ className?: string }>,
// ) => {
//   return (
//     <div className="border-b border-neutral-4 bg-neutral-6 last:border-0">
//       <div className={props.className}>{props.children}</div>
//     </div>
//   );
// };

export interface PanelIconButtonProps {
  icon: IconType;
  tooltip: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const PanelIconButton = (props: PanelIconButtonProps) => {
  return (
    <button className="link" title={props.tooltip} onClick={props.onClick}>
      <props.icon size={20} />
    </button>
  );
};

export const PanelHeader = (props: {
  title: string;
  buttons?: PanelIconButtonProps[];
}) => {
  return (
    <div
      className="flex flex-row items-center gap-2 border-b border-neutral-4
        bg-neutral-6 px-4 last:border-0"
    >
      <h2 className="grow py-2 text-lg font-bold">{props.title}</h2>

      {props.buttons?.map((buttonProps, index) => (
        <PanelIconButton key={index} {...buttonProps} />
      ))}
    </div>
  );
};

export const PanelSection = (props: PropsWithChildren) => {
  return <div className="p-4">{props.children}</div>;
};

export const PanelBody = (props: PropsWithChildren) => {
  return (
    <div className={"flex flex-col items-stretch bg-neutral-6"}>
      {props.children}
    </div>
  );
};

export const PanelWrapper = (
  props: PropsWithChildren<{ fullWidth?: boolean; className?: string }>,
) => {
  return (
    <section
      className={`mt-4 ${props.fullWidth ? "w-full" : ""} overflow-hidden
        rounded-md border border-neutral-4 shadow-lg ${
        props.className ? props.className : "" }`}
    >
      {props.children}
    </section>
  );
};
