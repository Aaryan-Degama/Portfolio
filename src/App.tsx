import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { CustomCursor } from "./components/CustomCursor";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";

function App() {
  return (
    <>
      <Loader />
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
