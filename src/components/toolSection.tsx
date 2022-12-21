import { PropsWithChildren } from "react";

export const ToolSectionHeader = (
  props: PropsWithChildren<{ className?: string }>
) => {
  return (
    <div className="bg-neutral-1 border-b last:border-0 border-black">
      <div className={props.className}>{props.children}</div>
    </div>
  );
};

export const ToolSectionBody = (
  props: PropsWithChildren<{ className?: string }>
) => {
  return <div className={props.className}>{props.children}</div>;
};

export const ToolSectionWrapper = (
  props: PropsWithChildren<{ fullWidth?: boolean; className?: string }>
) => {
  return (
    <section
      className={`mt-4 ${
        props.fullWidth ? "w-full" : ""
      } bg-neutral-0 rounded-md border shadow-lg border-black overflow-hidden ${
        props.className ? props.className : ""
      }`}
    >
      {props.children}
    </section>
  );
};
