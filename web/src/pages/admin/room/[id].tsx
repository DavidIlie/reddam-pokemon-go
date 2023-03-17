import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";

const GetByID: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <QRCode value={id as string} className="p-4" />;
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
