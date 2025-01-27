import { PropsWithChildren } from "react";

const Overlay = (props: PropsWithChildren) => {
  return (
    <div
      className="fixed left-0 top-0 flex h-full w-full flex-col items-center
        justify-center bg-black bg-opacity-75"
    >
      <div className="rounded-md bg-neutral-0 p-2">{props.children}</div>
    </div>
  );
};

export default Overlay;
