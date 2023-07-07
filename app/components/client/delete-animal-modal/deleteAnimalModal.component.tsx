import { Modal } from "../modal/modal.component";
import { useEffect, useRef, useState } from "react";
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

  const dispatch = useDispatch();
  const deleteAnimalModalConfirmButtonRef: any = useRef(null);
  const errorModalConfirmButtonRef: any = useRef(null);

  setTimeout(() => {
    deleteAnimalModalConfirmButtonRef.current?.focus();
    errorModalConfirmButtonRef.current?.focus();
  });

  const { animals, selectedAnimal } = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; }) => {
    return state;
  });

  async function updateAnimals() {
    dispatch(resetAnimals());

    for (let c = 0; c < animals.length; c++) {
      const reset = c == 0;
      const pageOfAnimals = await getAnimalsFromDBWithPagination({ reset: reset });
      dispatch(addAnimals({ animals: pageOfAnimals }));
    }
  }

  useEffect(() => {
    setShowDeleteAnimalModal(!!deleteAnimalModalData.id);
  }, [deleteAnimalModalData]);

  const [showDeleteAnimalModal, setShowDeleteAnimalModal] = useState(false);
  const [deleteDocError, setDeleteDocError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  return (
    <>
    <Modal isOpen={showDeleteAnimalModal}>
      <section className={styles["delete-animal-modal"]}>
        <p>Are you sure you want to delete &quot;{name}&quot; from the database?</p>
        <section className={styles["delete-animal-modal__buttons"]}>
          <button
            className={[styles["button"], styles["button--primary"]].join(' ')}
            ref={deleteAnimalModalConfirmButtonRef}
            onClick={async () => {
              try {
                await deleteAnimalFromDatabase(docID);
              } catch (error: any) {
                setDeleteDocError(error.toString());
                setShowDeleteAnimalModal(false);
                setShowErrorModal(true);
                return;
              }

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
    <Modal isOpen={!showDeleteAnimalModal && showErrorModal}>
      <section className={styles["error-modal"]}>
        <header className={styles["error-modal__header"]}>
          <span>&#x1F62C;</span>
          <h1 className={styles["error-modal__heading"]}>YOU MUST BE LOGGED IN TO DELETE ANIMALS</h1>
          <span>&#x1F62C;</span>
        </header>
        <p>{deleteDocError}</p>
        <button
          className={[styles["button"], styles["button--primary"], styles["error-modal__button"]].join(' ')}
          ref={errorModalConfirmButtonRef}
          onClick={() => {
            setShowErrorModal(false);
          }}>OK</button>
      </section>
    </Modal>
    </>
  )
}
