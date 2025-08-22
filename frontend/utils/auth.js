import { useEffect, useState, createContext, Children, useContext } from "react";
import { auth } from './firebase'
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast"



export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}
const useAuth = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
            setUser(localUser);
        }
        if (user) {
            router.push('/dashboard');
        }
        console.log(user)
    }, [])



    const googleSignIn = async () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider).then((res) => {
            console.log("User Signed In!!!")
            console.log(res.user)

            localStorage.setItem('user', JSON.stringify(res.user));
            toast.success("Login Successful")
            router.push('/dashboard')
        }).catch((error) => {
            console.log(error.message)
        })
    }

    const signInGithub = () => {
        const githubProvider = new GithubAuthProvider()
        return signInWithPopup(auth, githubProvider).then((res) => {
            console.log("User Signed In!!!")
            console.log(res.user)
            localStorage.setItem('user', JSON.stringify(res.user));
            toast.success("Login Succes")
            router.push('/dashboard')

        }).catch((error) => {
            console.log(error.message)
        })
    }

    const emailSignIn = async (email, password) => {
        try {
            // Try to sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Signed In!!!");
            console.log(user);

            localStorage.setItem('user', JSON.stringify(user));
            router.push('/dashboard')
        } catch (signInError) {
            // If user is not found, sign up the user
            if (signInError.code === 'auth/user-not-found') {
                try {
                    const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const newUser = newUserCredential.user;
                    console.log("User Signed Up!!!");
                    toast.success("Login Succes")
                    console.log(newUser);
                    router.push('/dashboard')

                } catch (signUpError) {
                    console.error(signUpError.message);
                }
            } else {
                console.error(signInError.message);
            }
        }
    };


    const signOut = () => {
        return auth.signOut().then(() => {
            console.log("User Signed Out!!!")
            toast.success("Logout Successful")
            localStorage.removeItem('user');
            setUser(null);
            router.push('/')
        })
    }

    return { user, setUser, googleSignIn, signInGithub, emailSignIn, signOut }

}
