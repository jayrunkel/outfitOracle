import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as Realm from "realm-web";

import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import OutfitElementsDetails from "../../components/OutfitElementsDetails";
import Outfit from "../../components/Outfit";

const OutfitElements = () => {
  const [outfit, setOutfit] = useState();
  const { query } = useRouter();

  const getAndSetOutfit = async () => {
    if (query.id) {
      // add your Realm App Id to the .env.local file
      const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
      const app = new Realm.App({ id: REALM_APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        const oneOutfit = await user.functions.getOneOutfit(query.id);
        console.log(oneOutfit);
        setOutfit(() => oneOutfit);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getAndSetOutfit()
  }, [query]);

  return (
    <>
      {outfit && (
        <>
          <Head>
            <title>MongoDB E-Commerce Demo - {outfit.productDisplayName || "NO PRODUCT NAME"}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="bg-white w-full min-h-screen">
            <Header />
            <Container>
              <OutfitElementsDetails outfit={outfit}/>
            </Container>
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default OutfitElements;
