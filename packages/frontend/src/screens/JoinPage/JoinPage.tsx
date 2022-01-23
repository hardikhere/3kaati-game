import { useSocket } from "contexts/Socketio/SocketIoContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function JoinPage() {
  const params = useParams();
  const socketio = useSocket();
  useEffect(() => {
    socketio?.open();
    console.log(
      "🚀 ~ file: JoinPage.tsx ~ line 10 ~ useEffect ~ params.roomId",
      params.roomId
    );
    socketio?.emit("JOIN_ROOM", params.roomId);
  }, []);
  return <div>joining..</div>;
}

export default JoinPage;
