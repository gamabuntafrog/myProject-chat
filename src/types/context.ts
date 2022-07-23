import {DocumentData, Firestore } from "firebase/firestore"
import {Auth, User} from "firebase/auth"
import {FirebaseApp} from "firebase/app"

type user = {
    bio: string,
    nickname: string,
    photoURL: string,
    userId: string,
}

type context = {auth: Auth, app: FirebaseApp, firestore: Firestore, user: DocumentData | undefined, isUserLoading: boolean}

export default context