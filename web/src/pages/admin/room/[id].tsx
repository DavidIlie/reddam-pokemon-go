import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";

const GetByID: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  return (
    <div className="p-3">
      <h1 className="mb-2 text-center text-2xl font-bold">{id}</h1>
      <div className="flex w-full justify-center">
        <QRCode value={id as string} />
      </div>
    </div>
  );
};

export default GetByID;

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
