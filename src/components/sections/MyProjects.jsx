import React from "react";
import { categories } from "../../data/projectIndex";
import ProjectCard from "./ProjectCard";

export default function FeaturedProjects() {
  return (
    <section id="projects" className="flex flex-col gap-24 bg-black py-64">

      {/* Heading */}
      <div className="max-w-6xl px-12 md:px-24 font-inter">
        <p className="text-6xl font-semibold leading-tight text-snow md:text-7xl">
          Discover my latest works that bring ideas to life
        </p>
      </div>

      {/* Projects grid */}
      <div className="grid w-full gap-8 px-12 mx-auto md:px-24 md:grid-cols-2">
        {Object.keys(categories).map((key) => (
          <ProjectCard key={key} categoryKey={key} />
        ))}
      </div>

    </section>
  );
}
