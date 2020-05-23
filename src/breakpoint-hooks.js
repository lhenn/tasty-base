import React, { createContext, useContext, useEffect, useState } from "react";
import { shallowIsEqual } from "./utils";

const defaultValue = {};
const BreakpointContext = createContext(defaultValue);

// Provides a context with results of media queries
export const BreakpointProvider = ({ children, queries }) => {
  // State in which we maintain matching query
  const [queryMatches, setQueryMatch] = useState({});
  const [curQueries, setCurQueries] = useState(null);

  // Only change queries if they've really been updated
  if (!curQueries || !shallowIsEqual(curQueries, queries)) {
    setCurQueries(queries);
  }

  // Triggers when queries are updated
  useEffect(() => {
    if (curQueries) {
      // Only run if queries changed. Subtle point: needs to be mutable so that
      // the value provided by BreakpointProvider changes, triggering child
      // rerenders!
      let matches = {};

      // Update query match value
      const handleQuery = (name, e) => {
        matches = {...matches, [name]: e.matches}
        setQueryMatch(matches);
      };

      // Track media query lists and handlers so they can be removed
      const mediaQueryLists = {};
      const handlers = {};

      // Attach listeners
      Object.entries(curQueries).forEach(([name, query]) => {
        mediaQueryLists[name] = window.matchMedia(query);
        matches[name] = mediaQueryLists[name].matches;
        handlers[name] = (e) => handleQuery(name, e);
        const handler = (e) => handleQuery(name, e);
        mediaQueryLists[name].addListener(handler);
        handlers[name] = handler;
      });

      // Set initial query match values, since listeners don't trigger on
      // attachment
      setQueryMatch(matches);

      // TODO: test cleanup
      return () => {
        Object.keys(curQueries).forEach((name) => {
          mediaQueryLists[name].removeListener(handlers[name]);
        });
      };
    }
  }, [curQueries]);

  return (
    <BreakpointContext.Provider value={queryMatches}>
      {children}
    </BreakpointContext.Provider>
  );
};

// Consumes breakpoint context
export const useBreakpoint = () => {
  const context = useContext(BreakpointContext);
  if (context === defaultValue) {
    throw new Error("useBreakpoint must be used within BreakpointProvider");
  }
  return context;
};
