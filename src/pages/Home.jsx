import Hero from "../components/Hero";
import Services from "../components/Services";
import NewArrival from "../components/NewArrival";
import OurBlog from "../components/OurBlog";
import Collections from "./Collection";

function Home() {
  return (
    <div>
      <Hero />
      
      <Collections/>
      <Services/>
      <OurBlog/>
    </div>
  );
}

export default Home;
