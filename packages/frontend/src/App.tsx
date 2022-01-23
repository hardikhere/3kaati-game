import SocketProvider from "contexts/Socketio/SocketIoContext";
import { Provider } from "react-redux";
import store from "store";
import AppRoutes from "./Routes";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </Provider>
    </div>
  );
}

export default App;
