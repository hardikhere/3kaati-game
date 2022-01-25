import { useSocket } from "contexts/Socketio/SocketIoContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";
import { getLink } from "utils/common";

function WaitingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketio = useSocket();
  const params = useParams();
  // TODO: add RootState instead of any
  const players = useSelector((state: any) => state.players);

  useEffect(() => {
    if (Object.keys(players).length === 2) navigate("/game");
  }, [players]);

  useEffect(() => {
    const me = players[0];
    socketio?.on("JOINED_ROOM", (players) => {
      players?.forEach((player) => {
        if (player.playerId !== me?.playerId) {
          dispatch(setPlayer(player));
        }
      });
    });
  }, []);
  return (
    <div>
      <h1>waiting for your friend to join room</h1>

      <a
        target="_blank"
        href={`${getLink()}/join/${params.roomId}`}
        rel="noreferrer"
      >
        link is here
      </a>
    </div>
  );
}

export default WaitingPage;
