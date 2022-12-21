import { ClientData } from "@lib/hooks";
import Link from "next/link";
import Spinner from "./spinner";

const ClientList = (props: {
  status: "error" | "success" | "idle" | "loading";
  clients: ClientData[];
}) => {
  return (
    <>
      <table className="text-left">
        <colgroup>
          <col className="" />
          <col className="w-40" />
          <col className="w-60" />
          <col className="w-60" />
        </colgroup>

        <thead className="bg-neutral-1 border-b border-black">
          <tr className="">
            <th className="my-4 pl-4">Name</th>
            <th className="my-4 border-l pl-4 border-black">Client Number</th>
            <th className="mx-4 py-2 border-l pl-4 border-black">
              Work Last Month
            </th>
            <th className="mx-4 border-l pl-4 border-black">
              Work Current Month
            </th>
          </tr>
        </thead>
        <tbody>
          {props.status === "success" &&
            props.clients.map((client, index) => {
              return (
                <tr
                  className="border-neutral-2 border-b last:border-0 \
                    last:mb-0 last:pb-0"
                  key={index}
                >
                  <td className="pl-4 py-2">
                    <Link
                      className="link"
                      href={`/clients/${encodeURIComponent(client.id)}`}
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="pl-4 py-2">{`${(
                    "0000" + client.clientNumber.toString()
                  ).slice(-5)}`}</td>
                  <td className="pl-4 py-2">
                    {`${client.lastMonthRevenue}€ /\
                     ${client.lastMonthHours}h`}
                  </td>
                  <td className="pl-4 py-2 text-green-300">
                    {`${client.currentMonthRevenue}€ / \
                      ${client.currentMonthHours}h`}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {props.status === "success" && props.clients.length === 0 && (
        <div className="text-center py-1">Empty</div>
      )}

      {props.status === "loading" && (
        <div className="flex flex-row justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ClientList;
