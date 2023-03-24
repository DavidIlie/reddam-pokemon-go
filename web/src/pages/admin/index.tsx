import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import QRCode from "react-qr-code";
import useSWR from "swr";
import { Connection, GameState } from "@prisma/client";

import RenderFinishTime from "../../components/RenderFinishTime";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Admin: NextPage<{ needPass?: boolean; error?: boolean }> = ({
  needPass = false,
  error = false,
}) => {
  if (error) return <div>Error</div>;

  if (needPass) return <GetPass />;

  const [teamname, setTeamname] = useState("");

  const [endTime, setEndTime] = useState<string>("");

  const inputStyle =
    "block bg-gray-100 border-2 border-gray-200 p-2 rounded-md w-full";
  const buttonStyle =
    "disabled:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:hover:bg-gray-200 w-full rounded-md border-2 border-blue-600 bg-blue-500 px-4 py-2 text-white duration-150 hover:border-blue-700 hover:bg-blue-600";

  const {
    data,
    isLoading,
    mutate: reload,
  } = useSWR<{ connections: Connection[]; gameState: GameState }>(
    "/api/admin/connections",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const [revealCode, setRevealCode] = useState<null | string>(null);

  return (
    <div className="px-4 py-2">
      <div className="gap-6 sm:flex">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const r = await fetch("/api/admin/create-connection", {
              method: "POST",
              body: JSON.stringify({
                name: teamname,
              }),
            });
            if (r.status !== 200) return alert("error");
            setTeamname("");
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
          <div className="my-2" />
          <button className={buttonStyle} type="submit" disabled={!teamname}>
            create qr code for login
          </button>
        </form>
        {data && (
          <div>
            <h1 className="mb-2 text-xl font-medium">game manager</h1>
            {data?.gameState?.status !== "NOT_STARTED" && (
              <>
                <button
                  className={buttonStyle}
                  onClick={async () => {
                    const r = await fetch("/api/admin/game-state", {
                      method: "POST",
                      credentials: "include",
                      body: JSON.stringify({
                        endTime: null,
                        status: "NOT_STARTED",
                        startTime: null,
                      }),
                    });
                    if (r.status !== 200) alert("check console");
                    reload();
                  }}
                >
                  reset
                </button>
                <div className="my-1" />
              </>
            )}
            <button
              className={buttonStyle}
              onClick={async () => {
                const r = await fetch("/api/admin/game-state", {
                  method: "POST",
                  credentials: "include",
                  body: JSON.stringify({
                    endTime: data?.gameState.endTime,
                    status:
                      data?.gameState.status === "STARTED"
                        ? "FINISHED"
                        : "STARTED",
                    startTime: new Date(),
                  }),
                });
                if (r.status !== 200) alert("check console");
                reload();
              }}
              disabled={
                data?.connections.length === 0 ||
                data?.gameState?.endTime === null
              }
            >
              {data?.gameState?.status === "STARTED"
                ? "end game"
                : "start game"}
            </button>
            <div className="my-1" />
            <div className="flex items-center gap-1">
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <button
                className={buttonStyle}
                onClick={async () => {
                  const r = await fetch("/api/admin/game-state", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                      endTime: new Date(endTime),
                      status: "NOT_STARTED",
                    }),
                  });
                  if (r.status !== 200) alert("check console");
                  setEndTime("");
                  reload();
                }}
                disabled={endTime === ""}
              >
                configure
              </button>
            </div>
            <div className="my-1" />
          </div>
        )}
        <div className="sm:w-1/4">
          <h1 className="text-xl font-medium">misc</h1>-{" "}
          <Link
            href="/admin/rooms"
            className="duration-150 hover:text-blue-500 hover:underline"
          >
            get room qr codes
          </Link>
          <h1
            onClick={async () => {
              const r = await fetch("/api/admin/game-state", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                  production: data?.gameState.production ? false : true,
                }),
              });
              if (r.status !== 200) alert("check console");
              reload();
            }}
            className="cursor-pointer duration-150 hover:text-blue-500 hover:underline"
          >
            - switch to {data?.gameState.production ? "dev" : "prod"}
          </h1>
        </div>
      </div>
      {isLoading && !data && <div>Loading data...</div>}
      <div className="mt-2 grid grid-cols-2 justify-evenly gap-1 sm:grid-cols-4 sm:gap-4">
        {data?.connections?.map((connection) => (
          <div
            key={connection.id}
            className="mb-2 select-none text-center sm:w-min"
          >
            <div
              className="cursor-pointer bg-gray-500 duration-150 hover:bg-gray-600 sm:w-min"
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
            <div className="flex justify-center gap-2">
              <div>
                <h1
                  className="text-lg font-medium"
                  onClick={() => {
                    console.log(connection.connectionId);
                    navigator.clipboard.writeText(connection.connectionId!);
                  }}
                >
                  {connection.name}
                </h1>
                <p>points: {connection.foundRooms.length}</p>
                <p>connected: {connection.connected === true ? "yes" : "no"}</p>
                {connection.finishTime && (
                  <>
                    finish time:{" "}
                    <RenderFinishTime
                      startTime={data?.gameState?.startTime!}
                      endTime={connection.finishTime}
                    />
                  </>
                )}
              </div>
            </div>
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
