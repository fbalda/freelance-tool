import React, { PropsWithChildren } from "react";

export const TableColumns = (props: {
  columns: { title?: string; width?: number }[];
}) => {
  return (
    <>
      <colgroup>
        {props.columns.map((col, index) => {
          return (
            <col
              key={index}
              style={{
                width: col.width !== undefined ? `${col.width}rem` : undefined,
              }}
            />
          );
        })}
      </colgroup>

      <thead className="border-b border-neutral-4 bg-neutral-6">
        <tr className="">
          {props.columns.map((col, index) => {
            return (
              <th
                key={index}
                className={`${index > 0 ? "border-l border-neutral-4" : ""}
                mx-4 py-1 pl-4`}
              >
                {col.title}
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
};

export const TableBody = (props: PropsWithChildren) => (
  <tbody className="min-h-[12%] px-4">{props.children}</tbody>
);

export const Table = (props: PropsWithChildren) => {
  return <table className="text-left">{props.children}</table>;
};
