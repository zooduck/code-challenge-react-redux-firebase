import { getAnimalsFromDBWithPagination } from "@/app/firebase";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animalsSlice } from "@/app/animalsSlice";
import componentStyles from './paginationControls.module.css';
import globalStyles from '../../../globals.module.css';

const styles = {
  ...globalStyles,
  ...componentStyles
};

const { addAnimals, setCurrentAnimals } = animalsSlice.actions;

export function PaginationControls() {
  const dispatch = useDispatch();
  const { animals: animalsFromStore, currentPage } = useSelector((state: { animals: AnimalData[][]; currentPage: number; }) => {
    return state;
  });
  const [counter, setCounter] = useState(0);
  return (
    <section className={styles["pagination-controls"]}>
      <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={async () => {
        if (counter === 0) {
          return;
        }
        const updatedCounter = counter - 1;
        setCounter(updatedCounter);
        dispatch(setCurrentAnimals({ page: updatedCounter }));
      }}>Last</button>
      <span>Page {currentPage + 1}</span>
      <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={async () => {
        const nextCounter = counter + 1;

        if (animalsFromStore[nextCounter]) {
          dispatch(setCurrentAnimals({ page: nextCounter }));
          setCounter(nextCounter);

          return;
        }

        const animals = await getAnimalsFromDBWithPagination();

        if (!animals.length) {
          return;
        }

        dispatch(addAnimals({ animals: animals }));
        dispatch(setCurrentAnimals({ page: nextCounter }));
        setCounter(nextCounter);
      }}>Next</button>
    </section>
  )
}