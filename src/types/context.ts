import {DocumentData, Firestore } from "firebase/firestore"
import {Auth, User} from "firebase/auth"
import {FirebaseApp} from "firebase/app"
import {user} from "./user";



type context = {auth: Auth, app: FirebaseApp, firestore: Firestore, user: user | undefined, isUserLoading: boolean}

export default context