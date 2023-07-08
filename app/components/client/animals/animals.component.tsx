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
      </header>

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
