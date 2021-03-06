import { socketio } from "utils/socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";

function WaitingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // TODO: add RootState instead of any
  const players = useSelector((state: any) => state.players);

  useEffect(() => {
    if (Object.keys(players).length === 2) navigate("/game");
  }, [players]);

  useEffect(() => {
    socketio?.on("JOINED_ROOM", (player) => {
      dispatch(setPlayer({ ...player, isMe: false }));
    });
  }, []);
  return (
    <div>
      <h1>waiting for your friend to join room</h1>

      <a
        target="_blank"
        href={`${window.location.origin}/join/${params.roomId}`}
        rel="noreferrer"
      >
        link is here
      </a>
    </div>
  );
}

export default WaitingPage;
