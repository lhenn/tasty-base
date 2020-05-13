import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SortByContainer = styled.div`
  display: flex;
  align-items: center;
`;



const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [sortOptions, setSortOptions] = useState([
    { label: "newest", selected: true },
    { label: "tastiest", selected: false },
    { label: "easiest", selected: false }
  ]);

 
  // Load all posts
  useEffect(() => {
    getFirebase()
      .database()
      .ref("posts")
      .orderByChild("timestamp")
      .once(
        "value",
        (snapshots) => {
          let posts = [];
          snapshots.forEach((snapshot) => {
            posts.push({ slug: snapshot.key, post: snapshot.val() });
          });

          // Put newest posts first
          setPosts(posts.reverse());
          setLoading(false);
        },
        (err) => console.log("home: post loading failed with code: ", err.code)
      );
  }, []);
  const sort = (label) => {
    //TODO: use firebase to sort

    //update the dropdown
    let updatedSortOptions = [...sortOptions];
    updatedSortOptions.forEach(option=>option.selected = false);
    updatedSortOptions.find(option => option.label === label).selected = true;
    setSortOptions(updatedSortOptions);
  }


  if (loading) {
    return <h1>Loading...</h1>;
  }

  // slugs are unique and can thus be used as keys
  return (
    <>
      <HeaderWrapper>
        <h1>Recipes</h1>
        <SortByContainer>
          <span>Sort by: </span>
          <DropdownButton title={sortOptions.find(option=>option.selected === true).label}>
            {sortOptions.filter(option=>!option.selected).map(option => {
              return(
                <Dropdown.Item key={option.label} onClick={()=>sort(option.label)}>{option.label}</Dropdown.Item>
              )
            })}
          </DropdownButton>
        </SortByContainer>
      </HeaderWrapper>
      {posts.map(({ slug, post }) => (
        <RecipePreview key={slug} post={post} slug={slug} />
      ))}
    </>
  );
};

export default Home;
