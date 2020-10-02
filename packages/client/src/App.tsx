import React from "react";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { AppQuery, AppQueryVariables } from "./__generated__/AppQuery";
import { Language } from "./__generated__/globalTypes";

function App() {
  const { data, loading, error } = useQuery<AppQuery, AppQueryVariables>(
    gql`
      query AppQuery($language: Language!) {
        personalizedGreeting(language: $language)
      }
    `,
    {
      variables: {
        language: Language.ENGLISH,
      },
    }
  );

  return (
    <div className="App">
      {loading ? "Loading..." : error ? "Error!" : data?.personalizedGreeting}
    </div>
  );
}

export default App;
