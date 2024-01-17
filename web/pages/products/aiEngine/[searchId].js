import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as Realm from "realm-web";
import Category from "../../../components/Category";
import Container from "../../../components/Container";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Pagination from "../../../components/Pagination";
import Outfits from "../../../components/Outfits";

export default function Home() {
  const [outfits, setOutfits] = useState([]);
  const { query } = useRouter();

  const getProductRecommendations = async () => {
    // add your Realm App Id to the .env.local file
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();

    console.log({query: query});
    try {
      const user = await app.logIn(credentials);
      const recommendProducts = await user.functions.getSearchOutfitResults(query.searchId);
      setOutfits(() => recommendProducts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductRecommendations()
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Outfit Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white w-full min-h-screen">
        <Header />
        <Container>
          <Outfits outfits={outfits} />
          <Pagination />
        </Container>
        <Footer />
      </div>
    </div>
  );
}
