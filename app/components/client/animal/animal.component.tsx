import { useDispatch, useSelector } from "react-redux";
import { animalsSlice } from "@/app/animalsSlice";
import { useMemo } from "react";

import componentStyles from './animal.module.css';
import globalStyles from '../../../globals.module.css';
import { getAnimalsFromDBWithPagination } from "@/app/firebase";

const styles = {
  ...globalStyles,
  ...componentStyles,
};

const {
  replaceAnimals,
  setSelectedAnimal,
  addAnimalToBasket,
  removeAnimalFromBasket,
  updateCurrentAnimals,
  setDeleteAnimalModalData
} = animalsSlice.actions;

export function Animal(props: { data: AnimalData; amountInBasket: number; isSelected: boolean; }) {
  const { isSelected } = props;
  const { id, name, type, docID } = props.data;
  const dispatch = useDispatch();

  const { animals, deletedAnimals } = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; deletedAnimals: string[]; currentPage: number; }) => {
    return state;
  });

  const isDeleted = deletedAnimals.includes(id);

  const classList = useMemo(() => {
    const classList = [styles.animal];
    if (isSelected) {
      classList.push(styles['animal--selected']);
    }
    if (isDeleted) {
      classList.push(styles['animal--deleted']);
    }
    return classList;
  }, [isSelected, isDeleted]);

  const className = classList.join(' ');

  async function updateAnimals() {
    const newAnimals = [];
    for (let c = 0; c < animals.length; c++) {
      const reset = c == 0;
      const pageOfAnimals = await getAnimalsFromDBWithPagination({ reset: reset });
      if (!pageOfAnimals.length) {
        continue;
      }
      newAnimals.push(pageOfAnimals);
    }

    dispatch(replaceAnimals({ animals: newAnimals }));
    dispatch(updateCurrentAnimals());
  }

  return (
    <section className={className} onAnimationEnd={() => {
      updateAnimals();
    }}>
      <section onClick={() => {
        dispatch(setSelectedAnimal({ id: id }));
      }}>
        <h1 className={styles['animal__heading']}>{name} ({props.amountInBasket})</h1>
        <p>Type: {type}</p>
      </section>
      <section className={styles['animal__buttons']}>
        <button className={[styles["button"], styles["button--primary"]].join(' ')} onClick={() => {
          dispatch(addAnimalToBasket({ id: id }));
        }}>Add Item</button>
        <button className={[styles["button"],  styles["button--secondary"]].join(' ')} onClick={() => {
          dispatch(removeAnimalFromBasket({ id: id }));
        }}>Remove Item</button>
        <button className={[styles["button"], styles["button--danger"]].join(' ')} onClick={() => {
          dispatch(setDeleteAnimalModalData({ id: id, name: name, docID: docID }));
        }}>Delete</button>
      </section>
    </section>
  )
}
