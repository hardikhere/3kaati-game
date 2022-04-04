import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { IUser } from "store/reducers/playersSlice";

export default function usePlayers() {
    const playersObj = useSelector((state: RootState) => state.players);
    const playersArr = Object.values(playersObj);
    const [currentChance, setCurrentChance] = useState<IUser | null>(null);

    useEffect(() => {
        Object.values(playersObj).forEach(player => {
            if (player.hasChance) setCurrentChance(player);
        })
    }, [playersObj])
    const me = playersArr.find(player => player.isMe);
    const winner = playersArr.find(player => player.hasWon);

    return { playersArr, me, currentChance, winner };
}