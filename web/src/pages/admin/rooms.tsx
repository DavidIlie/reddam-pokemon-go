import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { markers } from "../../lib/markers";

const GetRooms: NextPage = () => {
  return (
    <div className="p-2">
      <h1 className="text-xl font-medium">get rooms</h1>
      <div className="my-1" />
      <ul className="w-min">
        {markers.map((marker, index) => (
          <Link
            href={`/admin/room/${marker.roomName}`}
            className="w-min"
            key={index}
          >
            <li className="text-lg duration-150 hover:text-blue-500">
              {marker.roomName}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default GetRooms;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { auth } = req.cookies;

    if (!auth) return { redirect: { destination: "/admin", permanent: false } };

    if (auth) {
      const r = await fetch(`${process.env.URL}/api/admin/check-auth`, {
        method: "POST",
        body: JSON.stringify({ token: auth }),
      });

      if (r.status !== 200)
        return { redirect: { destination: "/admin", permanent: false } };

      return { props: {} };
    }

    return { redirect: { destination: "/admin", permanent: false } };
  } catch (error) {
    return { redirect: { destination: "/admin", permanent: false } };
  }
};
