import { useSelector } from "react-redux";
import { Animal } from "../animal/animal.component";
import { Login } from "../login/login.component";
import { PaginationControls } from "../pagination-controls/paginationControls.component";
import styles from './animals.module.css';

export function Animals() {
  const { currentAnimals, basket, selectedAnimal, totalNumberOfAnimalsInDatabase } = useSelector((state: { animals: AnimalData[][]; currentAnimals: AnimalData[]; basket: string[]; selectedAnimal: string; totalNumberOfAnimalsInDatabase: number; }) => {
    return state;
  });

  const animalsItemsClassName = currentAnimals.length
    ? styles['animals__items']
    : [styles['animals__items'], styles['animals__items--empty']].join(' ');

  return (
    <section className={styles['animals']}>
      <header className={styles['animals__header']}>
        <h1 className={styles['animals__heading']}>Animals in basket: {basket.length} | Total Animals: {totalNumberOfAnimalsInDatabase}</h1>
        <Login/>
      </header>
      <details className={styles['animals__description']}>
        <summary className={styles['animals__description-summary']}>About this app</summary>
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

      </details>
      <section className={animalsItemsClassName}>
        {currentAnimals.map((animal: AnimalData) => {
          const amountInBasket = basket.filter((id) => {
            return id === animal.id;
          }).length;
          const isSelected = animal.id === selectedAnimal;
          return (
            <Animal key={animal.id} data={animal} isSelected={isSelected} amountInBasket={amountInBasket}/>
          )
        })}
      </section>
      <PaginationControls/>
    </section>
  )
}