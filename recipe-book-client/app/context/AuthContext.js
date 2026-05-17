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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: result.user.uid, email: result.user.providerData[0].email}),
      });

      // If the fetch completed but returned a non-2xx status, throw to be handled in the catch below.
      if (!response.ok) {
        throw new Error(`Registration failed (${response.status} ${response.statusText})`);
      }
    }).catch((error) => {
      const errorCode = error.code;
      signOut(auth);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({_id: result.user.uid, email: result.user.providerData[0].email}),
        });

        if (!response.ok) {
          throw new Error(`Registration failed (${response.status} ${response.statusText})`);
        }
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
      let userCred;
       await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
         userCred = userCredential;

         await updateProfile(userCredential.user, {
           displayName: `${ email.substring(0, email.lastIndexOf("@"))}`
         });

         setUser(userCredential.user);
       });
       
      /*await updateProfile(userCredential.user, {
        displayName: `${email.substring(0, email.lastIndexOf("@"))}`
      });

      setUser({...userCredential.user});*/

       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({_id: userCred.user.uid, email: email})
      });

      /*if(response.status === 400)
        return response.status;

     if (!response.ok) {
       // Log and return early instead of throwing (we're already inside try/catch)
       console.error(`Registration failed (${response.status} ${response.statusText})`);
       return;
     }*/

      await signOut(auth);
    } catch (error) {
      return 400;
    }
  };

  const logOut = async () => {
    await signOut(auth);
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