import { addDoc, animalCollection, getAnimalsFromDBWithPagination, getTotalNumberOfAnimalsInDatabase } from "@/app/firebase";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { animalsSlice } from "@/app/animalsSlice";
import { useState } from "react";
import { useSelector  } from "react-redux";
import componentStyles from './addAnimalForm.module.css';
import globalStyles from '../../../globals.module.css';

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
  const classList = [styles['add-animal-form-container']];
  if (animalFormVisible === 'visible') {
    classList.push(styles['add-animal-form-container--visible']);
  }

  const { animals } = useSelector((state: { animals: AnimalData[][]; currentPage: number; }) => {
    return state;
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

          await addDoc(animalCollection, {
            name: name.toLowerCase(),
            type: type.toLowerCase(),
            description: description,
            image_url: 'potato.png',
            id: crypto.randomUUID()
          });

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
        <select className={styles["add-animal-form__input"]} {...register("type", { required: true })}>
          <option disabled selected value={''}>Select a type</option>
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
    </section>
  );
}