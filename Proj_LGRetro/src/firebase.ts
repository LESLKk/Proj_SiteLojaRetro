//conexao servidor firebase

import { readFileSync} from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

const chave = JSON.parse(readFileSync("./serviceAccountKey.json", "utf-8"));

initializeApp({credential: cert(chave)});

export const db = getFirestore();
export const auth = getAuth();