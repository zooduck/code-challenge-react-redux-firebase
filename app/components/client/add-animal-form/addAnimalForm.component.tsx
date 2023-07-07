import {
  animalCollection,
  getAnimalsFromDBWithPagination,
  getTotalNumberOfAnimalsInDatabase
} from "@/app/firebase";
import { addDoc } from 'firebase/firestore/lite';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { animalsSlice } from "@/app/animalsSlice";
import { useState, useRef } from "react";
import { useSelector  } from "react-redux";
import componentStyles from './addAnimalForm.module.css';
import globalStyles from '../../../globals.module.css';
import { Modal } from '../modal/modal.component';

const styles = {
  ...globalStyles,
  ...componentStyles
};

const { addAnimals, resetAnimals, updateCurrentAnimals, setTotalNumberOfAnimalsInDatabase } = animalsSlice.actions;

export function AddAnimalForm() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      type: "",
      description: ""
    }
  });
  const [animalFormVisible, setAnimalFormVisibility] = useState('hidden');
  const [addDocError, setAddDocError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const classList = [styles['add-animal-form-container']];

  if (animalFormVisible === 'visible') {
    classList.push(styles['add-animal-form-container--visible']);
  }

  const { animals } = useSelector((state: { animals: AnimalData[][]; }) => {
    return state;
  });

  const errorModalConfirmButtonRef: any = useRef(null);

  setTimeout(() => {
    errorModalConfirmButtonRef.current?.focus();
  });


  return (
    <section className={classList.join(' ')}>
      <button className={[styles["button"], styles['add-animal-form-container__toggle-button']].join(' ')} onClick={() => {
        const visibility = animalFormVisible === 'visible' ? 'hidden' : 'visible';
        setAnimalFormVisibility(visibility);
      }}>Add New Animal</button>
      <form
        className={styles['add-animal-form']}
        onSubmit={handleSubmit(async (data) => {
          const { name, type, description } = data;

          try {
            await addDoc(animalCollection, {
              name: name.toLowerCase(),
              type: type.toLowerCase(),
              description: description,
              image_url: 'potato.png',
              image_height: 512,
              image_width: 512,
              id: crypto.randomUUID()
            });
          } catch (error: any) {
            setAddDocError(error.toString());
            setShowErrorModal(true);
            return;
          }

          reset();

          async function updateAnimals() {
            dispatch(resetAnimals());

            for (let c = 0; c < animals.length; c++) {
              const reset = c == 0;
              const pageOfAnimals = await getAnimalsFromDBWithPagination({ reset: reset });
              dispatch(addAnimals({ animals: pageOfAnimals }));
            }

            dispatch(updateCurrentAnimals());
          }

          const totalNumberOfAnimalsInDatabase = await getTotalNumberOfAnimalsInDatabase();
          dispatch(setTotalNumberOfAnimalsInDatabase(totalNumberOfAnimalsInDatabase));

          await updateAnimals();
      })}>
        <label>Name*</label>
        <input className={styles["add-animal-form__input"]} {...register("name", { required: true })} defaultValue="test" autoComplete='off' />
        {errors.name && <p className={styles["add-animal-form__error"]}>This field is required</p>}
        <label>Type*</label>
        <select defaultValue={''} className={styles["add-animal-form__input"]} {...register("type", { required: true })}>
          <option disabled value={''}>Select a type</option>
          <option>Mammal</option>
          <option>Cat</option>
          <option>Rodent</option>
          <option>Fish</option>
          <option>Reptile</option>
          <option>Amphibian</option>
          <option>Bird</option>
          <option>Waterfowl</option>
        </select>
        {errors.type && <p className={styles["add-animal-form__error"]}>This field is required</p>}
        <label>Description*</label>
        <textarea className={[styles["add-animal-form__input"], styles["add-animal-form__input--description"]].join(' ')} {...register("description", { required: true })} autoComplete='off' rows={4}></textarea>
        {errors.description && <p className={styles["add-animal-form__error"]}>This field is required</p>}
        <input className={[styles["button"], styles["button--secondary"]].join(' ')} type="submit" />
      </form>

      <Modal isOpen={showErrorModal}>
        <section className={styles["error-modal"]}>
          <header className={styles["error-modal__header"]}>
            <span>&#x1F62C;</span>
            <h1 className={styles["error-modal__heading"]}>YOU MUST BE LOGGED IN TO ADD ANIMALS</h1>
            <span>&#x1F62C;</span>
          </header>
          <p>{addDocError}</p>
          <button
            autoFocus={true}
            ref={errorModalConfirmButtonRef}
            className={[styles["button"], styles["button--primary"], styles["error-modal__button"]].join(' ')}
            onClick={() => {
              setShowErrorModal(false);
            }}>OK</button>
        </section>
      </Modal>
    </section>
  );
}