import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useContext } from "react";
import { Context } from "../..";



const Login = () => {

    const context = useContext(Context)
    console.log(context);
    const onAuth = () => {
        const provider = new GoogleAuthProvider();

        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            // ...
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

    }

    return (
        <div className="login-container">
            <h1>ВХОД</h1>
            <button className="login-button" onClick={onAuth}>Войти через Google</button>
        </div>
    );
}

export default Login;
