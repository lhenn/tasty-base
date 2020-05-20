import React from "react";

const About = () => {
  // TODO: load content from file or Firebase instead of hard-coding.
  return (
    <>
      <h1>About Tasty Base</h1>
      <p>
        We (Adam Coogan and Laura Henn) started building Tasty Base while living
        in Amsterdam in March 2020, around when the COVID-19 pandemic was
        getting going. With a lot more time for cooking and coding what with
        normal life being on hold, we decided to build the recipe website we'd
        wanted for year. Our aims:
      </p>
      <ul>
        <li>
          Posts can be personal recipes, links to websites, or references to
          cookbooks, and users can favorite posts. Tasty Base is like your
          personal recipe book (or shared Dropbox folder full of text files)
          combined with Pinterest.
        </li>
        <li>
          A "wish list" for jotting down recipe ideas. Adam found this really
          important since he was previously using a giant text file.
        </li>
        <li>Realistic taste and ease ratings for each recipe.</li>
        <li>No advertisements or life stories you have to scroll through to get to recipes.</li>
      </ul>
      <p>There are several cool features we'll be adding soon:</p>
      <ul>
        <li>
          Tags for recipes and wishes, and accompanying filtering options for
          the home page.
        </li>
        <li>The ability for users to comment on and rate recipes</li>
      </ul>
    </>
  );
};

export default About;
