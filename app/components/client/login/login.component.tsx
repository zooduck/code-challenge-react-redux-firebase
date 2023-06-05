import { animalsSlice } from "@/app/animalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import componentStyles from './login.module.css';
import globalStyles from '../../../globals.module.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const styles = {
  ...globalStyles,
  ...componentStyles
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

    if (localStorageLoggedIn && loggedIn === 'false') {
      dispatch(login({ user: localStorageLoggedInUser }));
      dispatch(initBasket({ basket: localStorageBasket }));
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

  const buttonText = loggedIn === 'true' ? `Logout: ${loggedInUser.email}` : 'Login';

  return (
    <button className={[styles["login-button"], styles["button"], styles["button--secondary"]].join(' ')} onClick={async () => {
      if (loggedIn === 'true') {
        dispatch(logout());
      } else {
        let user: any;
        try {
          // Login with firebase user account
          const auth = getAuth();
          const userCredential = await signInWithEmailAndPassword(auth, 'user@example.com', 'abc123');
          user = userCredential.user;
        } catch {
          // ...
        }
        if (!user) {
          return;
        }
        dispatch(login({ user: user }));
      }
    }}>{buttonText}</button>
  )
}