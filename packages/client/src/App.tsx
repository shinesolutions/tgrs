import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { Language } from "./shared/__generated__/graphql";

function App() {
  const { data, loading, error } = useQuery(
    gql(`
      query AppQuery($language: Language!) {
        personalizedGreeting(language: $language)
      }
    `),
    {
      variables: {
        language: Language.English,
      },
    }
  );

  return (
    <div className="App">
      {loading ? (
        <p role="alert">Loading...</p>
      ) : error ? (
        <p role="alert">Error!</p>
      ) : (
        <h1>{data?.personalizedGreeting}</h1>
      )}
    </div>
  );
}

export default App;
