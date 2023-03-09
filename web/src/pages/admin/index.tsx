import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";

const Admin: NextPage<{ needPass?: boolean; error?: boolean }> = ({
  needPass = false,
  error = false,
}) => {
  if (error) return <div>Error</div>;

  if (needPass) return <GetPass />;

  const createQRCodeForLogin = async () => {};

  const [qrCodeGenerated, setQrCodeGenerated] = useState("hey");

  return (
    <div>
      <button onClick={createQRCodeForLogin}>create QR code for login</button>
      {qrCodeGenerated && <QRCode value={qrCodeGenerated} />}
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
