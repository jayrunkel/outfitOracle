import Head from "next/head";
import React from "react";
import { useState, useEffect } from "react";
import * as Realm from "realm-web";
import Category from "../components/Category";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Pagination from "../components/Pagination";
import Products from "../components/Products";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  async function getAndSetAllProducts() {
    // add your Realm App Id to the .env.local file
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const allProducts = await user.functions.getAllProducts();
      setProducts(() => allProducts);
      const uniqueCategories = await user.functions.getUniqueCategories();
      setCategories(() => uniqueCategories);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAndSetAllProducts()
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Outfit Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white w-full min-h-screen">
        <Header/>
        <Container>
          <Hero />
          <Category
            category="Tech Wear"
            categories={categories}
            productCount={`${products.length} Products`}
          />
          <Products products={products}/>
          <Pagination />
        </Container>
        <Footer />
      </div>
    </div>
  );
}
