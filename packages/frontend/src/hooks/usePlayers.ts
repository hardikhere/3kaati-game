import { useSelector } from "react-redux";
import { RootState } from "store";

export default function usePlayers() {
    const playersObj = useSelector((state: RootState) => state.players);
    const playersArr = Object.values(playersObj);
    return { playersArr };
}