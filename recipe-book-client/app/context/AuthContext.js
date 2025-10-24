"use client";
import {useContext, createContext, useState, useEffect} from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import {auth} from '../firebase/firebase_config';

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const loginGithubAccount = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
    });
  }

  const githubAccount = async () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({_id: result.user.uid, email: result.user.providerData[0].email}),
      });
    }).catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
    });
  }

  const loginGoogleAccount = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      const errorCode = error.code;
      return Promise.reject(errorCode);
    });
  }

  const googleAccount = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      signInWithPopup(auth, provider).then(async (result) => {
        //const googleCredentials = GoogleAuthProvider.credentialFromResult(result);
        const response = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({_id: result.user.uid, email: result.user.providerData[0].email}),
        });
      }).catch((error) => {
        const errorCode = error.code;
        return Promise.reject(errorCode);
      });

    } catch (error) {
      return error;
    }

  };

  const emailAndPasswordRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: `${email.substring(0, email.lastIndexOf("@"))}`
      });

      setUser({...userCredential.user});

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({_id: userCredential.user.uid, email: email})
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
        await signOut(auth);
        return response.status;
      }

      await signOut(auth); //sign out user after email verification sent
      return response.status;
    } catch (error) {
      console.log(error.message);
    }
  };

  const logOut = () => {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{user, emailAndPasswordRegister, loginGithubAccount, githubAccount, loginGoogleAccount, googleAccount, logOut}}>
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext);
}