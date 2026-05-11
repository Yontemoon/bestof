import React from 'react'

const AboutPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="">About the "Best of".</h1>
      <section className="">
        <p>
          This site is a passion project born out of a simple problem:{' '}
          <strong>information overload.</strong> I love art in all its forms, but I realized I
          didn't have the capacity to keep up with every "Best of" list published at the end of each
          year.
        </p>
        <p>
          I wanted to create a central hub that curates the definitive rankings from major
          publications, making it easier for fans to discover the highlights of the year without the
          endless scrolling.
        </p>
      </section>
      <hr />
      <div className="space-y-3">
        <section>
          <h2 className="mb-2">The Curation Process</h2>
          <p>
            Unlike many modern aggregators, this site <strong>does not use web scraping</strong>.
            Every "Best of" list is hand-selected and verified by me. While there isn't a rigid
            mathematical formula for selection, I prioritize reputable, high-traffic publications
            for each category to ensure a balanced look at the year's cultural landscape. There will
            be bias of course. You'll notice most of the publications are American based, but I'll
            do my best to include as much of other countries as possible.
          </p>
        </section>

        <section>
          <h2 className="mb-2">The Vision</h2>
          <p>
            This project started as an excuse to flex my database muscles and build something
            tangible from scratch. It’s a blend of my technical interests and my appreciation for
            curated art, music, and film.
          </p>
        </section>
        <section>
          <h2 className="mb-2">Future Updates</h2>
          <p>
            I am still in the process of adding best movies and albums of 2025, but I have a list of
            things I am planning to add in the future.
          </p>
          <ul className="  list-disc pl-10">
            <li>Video games category</li>
            <li>Televisions category</li>
            <li>Books category</li>
            <li>Search bar for specific content</li>
            <li>Previous years (2024, 2023, 2022) for now.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
