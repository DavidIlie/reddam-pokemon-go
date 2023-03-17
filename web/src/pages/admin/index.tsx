import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import useSWR from "swr";
import { Connection } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Admin: NextPage<{ needPass?: boolean; error?: boolean }> = ({
  needPass = false,
  error = false,
}) => {
  if (error) return <div>Error</div>;

  if (needPass) return <GetPass />;

  const { push } = useRouter();

  const [teamname, setTeamname] = useState("");
  const [players, setPlayers] = useState("");

  const inputStyle =
    "block bg-gray-100 border-2 border-gray-200 p-2 rounded-md w-full";
  const buttonStyle =
    "w-full rounded-md border-2 border-blue-600 bg-blue-500 px-4 py-2 text-white duration-150 hover:border-blue-700 hover:bg-blue-600";

  const {
    data,
    isLoading,
    mutate: reload,
  } = useSWR<Connection[]>("/api/admin/connections", fetcher, {
    refreshInterval: 5000,
  });

  const [revealCode, setRevealCode] = useState<null | string>(null);

  return (
    <div className="px-4 py-2">
      <div className="flex gap-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await fetch("/api/admin/create-connection", {
              method: "POST",
              body: JSON.stringify({
                name: teamname,
                players: players,
              }),
            });
            if (r.status !== 200) return alert("error");
            setTeamname("");
            setPlayers("");
            reload();
          }}
          className="mb-2"
        >
          <h1 className="text-xl font-medium">create connection</h1>
          <div className="my-1" />
          <input
            className={inputStyle}
            placeholder="Team Name"
            id="teamname"
            value={teamname}
            onChange={(e) => setTeamname(e.target.value)}
          />
          <div className="my-1" />
          <input
            className={inputStyle}
            placeholder="Players"
            id="players"
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
          />
          <div className="my-1" />
          <button className={buttonStyle} type="submit">
            create qr code for login
          </button>
          <div className="my-1" />
          <button
            className={buttonStyle}
            type="button"
            onClick={() => {
              push("/admin/rooms");
            }}
          >
            get room qr
          </button>
        </form>
      </div>
      {isLoading && !data && <div>Loading data...</div>}
      <div className="mt-2 grid grid-cols-4 justify-evenly gap-4">
        {data?.map((connection) => (
          <div
            key={connection.id}
            className="mb-2 w-min select-none text-center"
          >
            <div
              className="w-min cursor-pointer bg-gray-500 duration-150 hover:bg-gray-600"
              onClick={() => {
                if (revealCode === connection.connectionId)
                  return setRevealCode(null);
                setRevealCode(connection.connectionId);
              }}
            >
              <QRCode
                value={connection.connectionId!}
                className={`${
                  revealCode !== connection.connectionId && "invisible"
                }`}
              />
            </div>
            <h1
              className="text-lg font-medium"
              onClick={() => {
                console.log(connection.connectionId);
                navigator.clipboard.writeText(connection.connectionId!);
              }}
            >
              {connection.name}
            </h1>
            <p>{connection.players.join(", ")}</p>
            <p>points: {connection.foundRooms.length}</p>
            {process.env.NODE_ENV !== "production" && (
              <textarea className="text-mono text-xs text-gray-400">
                {connection.connectionId}
              </textarea>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const GetPass: React.FC = () => {
  const { reload } = useRouter();
  useEffect(() => {
    const makeAuth = async () => {
      const pass = prompt("password");
      if (!pass) return alert("pass fail");
      const r = await fetch("/api/admin/admin-login", {
        method: "POST",
        body: JSON.stringify({ password: pass }),
      });
      if (r.status !== 200) return alert("fetch fail");
      const response = await r.json();
      document.cookie = `auth=${response.code}; path=/`;
      reload();
    };
    makeAuth();
  }, []);
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { auth } = req.cookies;

    if (!auth) return { props: { needPass: true } };

    if (auth) {
      const r = await fetch(`${process.env.URL}/api/admin/check-auth`, {
        method: "POST",
        body: JSON.stringify({ token: auth }),
      });

      if (r.status !== 200) return { props: { error: true } };

      return { props: {} };
    }

    return { props: { error: true } };
  } catch (error) {
    return { props: { error: true } };
  }
};

export default Admin;
