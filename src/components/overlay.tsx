import { PropsWithChildren } from "react";

const Overlay = (props: PropsWithChildren) => {
  return (
    <div
      className="fixed w-full h-full top-0 left-0 flex flex-col \ 
    items-center justify-center bg-opacity-75 bg-black"
    >
      <div className="bg-neutral-0 rounded-md p-2">{props.children}</div>
    </div>
  );
};

export default Overlay;
