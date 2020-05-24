import { useEffect, useRef } from "react";

const makeCancellable = (promise) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (result) => {
        console.log("success. cancelled?", hasCanceled);
        hasCanceled ? reject({ isCanceled: true }) : resolve(result);
      },
      (error) => {
        console.log("error. cancelled?", hasCanceled);
        hasCanceled ? reject({ isCanceled: true }) : reject(error);
      }
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};

// This hook returns a function that lets a component keep track of pending
// Promises and cancel them when it unmounts to avoid memory leaks. Note that
// addPromise(p) must be called before chaining .then() statements, so that p
// can be cancelled before the then statement resolvers execute!
//
// Example:
//
//   const Card = () => {
//     const addPromise = useCancellablePromises();
//     const [content, setContent] = useState();
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//       setLoading(true);
//       const promise = addPromise(fetchData()).then((data) => {
//         setContent(data);
//         setLoading(false);
//       });
//     }, []);
//   };
const useCancellablePromises = () => {
  // Track pending promises
  const promises = useRef([]);

  useEffect(() => {
    // Cancel all promises on unmount
    return () => {
      console.log("cancelling promises");
      promises.current.forEach((p) => p.cancel());
      promises.current = [];
    };
  }, []);

  const addPromise = (p) => {
    const promise = makeCancellable(p);
    promises.current.push(promise);
    return promise.promise;
  };

  return { addPromise };
};

export default useCancellablePromises;
