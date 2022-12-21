import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { MdMenu } from "react-icons/md";

interface MenuEntry {
  name: string;
  icon?: IconType;
  onClick: () => Promise<void>;
}

const HamburgerMenu = (props: { className?: string; entries: MenuEntry[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLElement>(null);

  const onGlobalClick = (event: MouseEvent) => {
    if (ref.current && ref.current.contains(event.target as Node)) {
      return;
    }

    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", onGlobalClick);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.removeEventListener("click", onGlobalClick);
    };
  }, []);

  return (
    <nav
      className={`${props.className || ""} relative z-2 my-auto p-2`}
      ref={ref}
    >
      {isOpen ? (
        <div
          className="absolute top-full right-0 bg-neutral-1 border border-black 
        z-1 pr-8 p-4 text-right text-md rounded-md 
        shadow-xl flex flex-col gap-2"
        >
          {props.entries.map((entry, index) => (
            <button
              className="flex flex-row flex-nowrap items-center justify-start 
              whitespace-nowrap gap-2"
              key={index}
              onClick={async (event) => {
                event.preventDefault();
                await entry.onClick();
              }}
            >
              {entry.icon?.({ size: 20 })}
              {entry.name}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}

      <button
        className="relative align-middle"
        onClick={() => setIsOpen((current) => !current)}
      >
        <MdMenu size={24} />
      </button>
    </nav>
  );
};

export default HamburgerMenu;
