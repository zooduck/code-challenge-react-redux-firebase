import { animalsSlice } from "@/app/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import globalStyles from '../../../globals.module.css';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const styles = {
  ...globalStyles
};

const { login, logout, initBasket } = animalsSlice.actions;

export function Login() {
  const dispatch = useDispatch();
  const { basket, loggedIn } = useSelector((state: { loggedIn: string; basket: string[] }) => {
    return state;
  });

  useEffect(() => {
    const localStorageLoggedIn = localStorage.getItem('logged-in') === 'true';
    const localStorageBasket = JSON.parse(localStorage.getItem('basket') || '[]');
    const localStorageLoggedInUser = JSON.parse(localStorage.getItem('logged-in-user') || '{}');

    if (localStorageLoggedIn && !loggedIn) {
      tryLogin().then(() => {
        dispatch(login({ user: localStorageLoggedInUser }));
        dispatch(initBasket({ basket: localStorageBasket }));
      });
    }

    if (loggedIn) {
      localStorage.setItem('basket', JSON.stringify(basket));
    } else {
      localStorage.removeItem('basket');
    }
  }, [loggedIn, basket, dispatch])


  const { loggedInUser } = useSelector((state: { loggedInUser: any; }) => {
    return state;
  });

  const buttonText = loggedIn ? `Logout: ${loggedInUser.email}` : 'Login';

  const tryLogin = async () => {
    let user: any;
    try {
      // Login with firebase user account
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, 'user@example.com', 'abc123');
      user = {
        email: userCredential.user.email,
        uid: userCredential.user.uid
       };
    } catch (error) {
      console.error(error);
    }
    return user;
  }

  return (
    <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={async () => {
      if (loggedIn) {
        try {
          const auth = getAuth();
          await signOut(auth);
          dispatch(logout());
        } catch (error) {
          console.error(error);
        }
      } else {
        const user: any = await tryLogin();
        if (!user) {
          return;
        }
        dispatch(login({ user: user }));
      }
    }}>{buttonText}</button>
  )
}