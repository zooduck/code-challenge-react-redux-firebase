import { Modal } from "../modal/modal.component";
import { useRef } from "react";
import { animalsSlice } from "@/app/animalsSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getAnimalsFromDBWithPagination, getTotalNumberOfAnimalsInDatabase, deleteAnimalFromDatabase } from "@/app/firebase";
import componentStyles from './deleteAnimalModal.module.css';
import globalStyles from '../../../globals.module.css';

const styles = {
  ...globalStyles,
  ...componentStyles
};

const {
  removeAnimalFromBasket,
  setSelectedAnimal,
  resetAnimals,
  addAnimals,
  setDeleteAnimalModalData,
  updateDeletedAnimals,
  setTotalNumberOfAnimalsInDatabase
} = animalsSlice.actions;

export function DeleteAnimalModal() {
  const { deleteAnimalModalData } = useSelector((state: { deleteAnimalModalData: any }) => {
    return state;
  });

  const { id, name, docID } = deleteAnimalModalData;
  const isOpen = !!deleteAnimalModalData.id;

  const dispatch = useDispatch();
  const confirmButtonRef: any = useRef(null);

  setTimeout(() => {
    confirmButtonRef.current?.focus();
  });

  const { animals, selectedAnimal } = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; }) => {
    return state;
  });

  async function updateAnimals() {
    dispatch(resetAnimals());

    for (let c = 0; c < animals.length - 1; c++) {
      const reset = c == 0;
      const pageOfAnimals = await getAnimalsFromDBWithPagination({ reset: reset });
      dispatch(addAnimals({ animals: pageOfAnimals }));
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <section className={styles["delete-animal-modal"]}>
        <p>Are you sure you want to delete &quot;{name}&quot; from the database?</p>
        <section className={styles["delete-animal-modal__buttons"]}>
          <button
            className={[styles["button"], styles["button--primary"]].join(' ')}
            ref={confirmButtonRef}
            onClick={async () => {
            await deleteAnimalFromDatabase(docID);

            dispatch(removeAnimalFromBasket({ id: id, removeAllInstances: true }));

            if (id === selectedAnimal) {
              dispatch(setSelectedAnimal({ id: animals[0][0].id }));
            }

            dispatch(setDeleteAnimalModalData({ id: '', name: '', docID: '' }));
            dispatch(updateDeletedAnimals({ id: id }));

            const totalNumberOfAnimalsInDatabase = await getTotalNumberOfAnimalsInDatabase();
            dispatch(setTotalNumberOfAnimalsInDatabase(totalNumberOfAnimalsInDatabase));

            await updateAnimals();
          }} onKeyDown={(event) => {
            const { key, shiftKey } = event;
            if (key === 'Tab' && shiftKey) {
              event.preventDefault();
            }
          }}>Confirm</button>
          <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={() => {
            dispatch(setDeleteAnimalModalData({ id: '', name: '', docID: '' }));
          }} onKeyDown={(event) => {
            const { key, shiftKey } = event;
            if (key === 'Tab' && !shiftKey) {
              event.preventDefault();
            }
          }}>Cancel</button>
        </section>
      </section>
    </Modal>
  )
}
