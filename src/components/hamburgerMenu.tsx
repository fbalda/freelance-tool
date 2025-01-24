import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { MdMenu } from "react-icons/md";

interface MenuEntry {
  name: string;
  icon?: IconType;
  onClick: () => Promise<void>;
}

const HamburgerMenu = (props: {
  className?: string;
  entries: MenuEntry[];
}) => {
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
      className={`${props.className || ""} z-2 relative my-auto p-2`}
      ref={ref}
    >
      {isOpen ? (
        <div
          className="z-1 text-md absolute right-0 top-full flex flex-col gap-2
            rounded-md border border-black bg-neutral-1 p-4 pr-8 text-right
            shadow-xl"
        >
          {props.entries.map((entry, index) => (
            <button
              className="flex flex-row flex-nowrap items-center justify-start
                gap-2 whitespace-nowrap"
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
