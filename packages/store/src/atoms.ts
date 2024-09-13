import { atom } from "recoil";

export const balanceAtom = atom<number>({
    key: "balance",
    default: 0,
});

export const nameAtom = atom<string>({
    key: "name",
    default:"Anmol"
});