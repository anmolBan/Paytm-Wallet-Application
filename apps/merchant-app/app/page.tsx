"use client"

import { useRecoilState } from "recoil";
import { balanceAtom } from "@repo/store/atoms";
export default function Home() {
  const [ balance, setBalance ] = useRecoilState(balanceAtom);
  return (
    <div>
      Hello Moto {balance}
      <button onClick={() => {
        setBalance(balance + 1)
      }}>+</button>
      <button onClick={() => {
        setBalance(balance - 1)
      }}>-</button>
    </div>
  );
}
