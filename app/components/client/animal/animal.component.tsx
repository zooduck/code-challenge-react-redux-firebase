import { useDispatch, useSelector } from "react-redux";
import { animalsSlice } from "@/app/animalsSlice";
import { useEffect, useState, useMemo } from "react";

import componentStyles from './animal.module.css';
import globalStyles from '../../../globals.module.css';

const styles = {
  ...globalStyles,
  ...componentStyles,
};

const {
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

  const { animals, deletedAnimals } = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; deletedAnimals: string[]; }) => {
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

  const [className, setClassName] = useState(classList.join(' '));

  useEffect(() => {
    setClassName(classList.join(' '));
  }, [classList]);

  return (
    <section className={className} onAnimationEnd={() => {
      dispatch(updateCurrentAnimals());
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