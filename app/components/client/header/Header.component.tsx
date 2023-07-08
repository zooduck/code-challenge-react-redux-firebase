import { Login } from "../login/login.component";
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles['header']}>
      <section className={styles['header__login']}>
        <Login />
      </section>

      <details className={styles['header__description']}>
        <summary className={styles['header__description-summary']}>About this app</summary>
        <p>
          This app was built using create-next-app, redux-toolkit and firebase and deployed using Vercel.
        </p>
        <p>
          Animals are fetched from the firestore database in batches of 4 using paginated queries.
        </p>
        <p>
          You will need to login if you want to add or delete animals. Also, the basket is cached by
          localStorage when you are logged in.
        </p>
        <p>
          <a
            className={styles['header__description-github-link']}
            href="https://github.com/zooduck/code-challenge-react-redux-firebase"
            target="_blank">
              View project on Github
          </a>
        </p>
      </details>
    </header>
  )
}
