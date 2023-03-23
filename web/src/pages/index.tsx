import type { NextPage, GetServerSideProps } from "next";

const Home: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: "/admin", permanent: true } };
};

export default Home;
