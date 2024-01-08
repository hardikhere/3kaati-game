import { socketio } from "utils/socket";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setPlayer } from "store/reducers/playersSlice";
import {
  WaitingButton,
  WaitingContainer,
  WaitingForm,
} from "screens/WaitingRoom/waitingStyles";

function WaitingPage() {
  const dispatch = useDispatch();
  const [isCopied, setIsCopied] = useState(false);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/join/${params.roomId}`
      );
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500); // Reset the "Copied!" message after 1.5 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  return (
    <WaitingContainer>
      <WaitingForm>
        <h1>waiting for your friend to join room</h1>

        <a
          target="_blank"
          href={`${window.location.origin}/join/${params.roomId}`}
          rel="noreferrer"
        >
          link is here
        </a>
        <WaitingButton as="button" onClick={copyToClipboard}>
          {isCopied ? "Copied!" : "Copy"}
        </WaitingButton>
      </WaitingForm>
    </WaitingContainer>
  );
}

export default WaitingPage;
