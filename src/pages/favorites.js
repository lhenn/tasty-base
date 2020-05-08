import React, { useContext, useEffect, useState } from "react";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";
import { UserContext } from "../App";

const downloadPost = async (slugs) => {
  let posts = [];

  for (const slug of slugs) {
    const snapshot = await getFirebase()
      .database()
      .ref(`posts/${slug}`)
      .once("value");
    posts.push({ slug, post: snapshot.val() });
  }

  return posts;
};

const FavoritesList = ({ posts }) => (
  <>
    <h1>Favorite recipes</h1>
    <div>
      {posts.map(({ slug, post }) => (
        <RecipePreview key={slug} post={post} slug={slug} />
      ))}
    </div>
  </>
);

// TODO: must be inaccessible if user is not logged in, but should show loading
// message if waiting for authentication
const Favorites = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { user, userData } = useContext(UserContext);

  // Load all posts if userData is present
  useEffect(() => {
    if (!user) {
      setLoading(true);
    } else if (userData) {
      // User is present and has non-empty data: load it
      setLoading(true);

      const favSlugs = Object.keys(userData.favoriteRecipes);
      downloadPost(favSlugs)
        .then((favPosts) => {
          setPosts(favPosts);
          setLoading(false);
        })
        .catch((err) => console.log("Favorites: downloadPost failed: ", err));
    } else {
      // User is authenticated, but they have no data
      setPosts([]);
      setLoading(false);
    }
  }, [user, userData, setPosts, setLoading]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // slugs are unique and can thus be used as keys
  return (
    <>
      {posts.length > 0 ? (
        <FavoritesList posts={posts} />
      ) : (
        <p>No favorites added yet!</p>
      )}
    </>
  );
};

export default Favorites;
