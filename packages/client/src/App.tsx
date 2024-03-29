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
