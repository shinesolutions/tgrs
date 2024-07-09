import { graphql } from "./__generated__";
import { Language } from "./__generated__/graphql";
import "./App.css";
import { useQuery } from "@apollo/client";

function App() {
  const { data, loading, error } = useQuery(
    graphql(`
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
