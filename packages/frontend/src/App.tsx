import { Provider } from "react-redux";
import store from "store";
import AppRoutes from "./Routes";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </div>
  );
}

export default App;
