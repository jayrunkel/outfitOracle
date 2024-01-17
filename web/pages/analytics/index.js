import Head from "next/head";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Outfit Oracle</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white w-full min-h-screen">
        <Header />
        <Container>
          <div className="flex justify-center">
            <div className="text-green-500 text-4xl font-semibold">Analytics</div>
          </div>
        <iframe style={{background: "#F1F5F4", border: "none", "border-radius": "2px", "boxShadow": "0 2px 10px 0 rgba(70, 76, 79, .2)", width: "100vw", height: "100vh"}}  src="https://charts.mongodb.com/charts-tselebis-wmawi/embed/dashboards?id=91c71af6-495e-48bb-a63b-1c5da910318f&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale"></iframe>
        </Container>
        <Footer />
      </div>
    </div>
  );
}
