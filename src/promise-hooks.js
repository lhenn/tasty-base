import { useEffect, useRef } from "react";

const makeCancellable = (promise) => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (result) =>
        hasCanceled ? reject({ isCanceled: true }) : resolve(result),
      (error) => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
};

const useCancellablePromises = () => {
  // Track pending promises
  const promises = useRef([]);

  useEffect(() => {
    // console.log("useCancellablePromises mount:", promises);

    // Cancel all promises on unmount
    return () => {
      // console.log("useCancellablePromises unmount");
      promises.current.forEach((p) => p.cancel());
      promises.current = [];
    };
  }, []);

  const addPromise = (p) => {
    console.log("adding a promise");
    const promise = makeCancellable(p);
    promises.current.push(promise);
    return promise.promise;
  };

  return { addPromise };
};

export default useCancellablePromises
