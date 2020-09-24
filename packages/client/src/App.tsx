import React from "react";
import "./App.css";
import { gql, useQuery } from "@apollo/client";

function App() {
  const { data, loading, error } = useQuery(gql`
    query {
      greeting
    }
  `);

  return (
    <div className="App">
      {loading ? "Loading..." : error ? "Error!" : data.greeting}
    </div>
  );
}

export default App;
