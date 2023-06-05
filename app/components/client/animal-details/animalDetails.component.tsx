import { useSelector } from 'react-redux';
import Image from 'next/image';
import styles from './animalDetails.module.css';

export function AnimalDetails() {
  const data = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; }) => {
    return state.animals.flat().find((animal) => {
      return animal.id === state.selectedAnimal;
    }) || state.animals.flat()[0] || {};
  });
  const { name, type, description, image_url } = data;
  const imageSrc = `/${image_url}`;
  const animalDetailsHeading = name ? `${name} (${type})` : '';

    if (name && description) {
      return (
        <section className={styles['animal-details']}>
        <h1 className={styles['animal-details__heading']}>{animalDetailsHeading}</h1>
        <figure className={styles['animal-details__figure']}>
          <Image className={styles['animal-details__image']} src={imageSrc} alt={name}/>
          <figcaption className={styles['animal-details__caption']}>{description}</figcaption>
        </figure>
      </section>
      )
    } else {
      return (
        <section className={styles['animal-details']}>
          <h1 className={[styles['animal-details__heading'], styles['animal-details__heading--empty']].join(' ')}>{animalDetailsHeading}</h1>
          <figure className={styles['animal-details__figure']}>
            <section className={styles['animal-details__image-placeholder']}></section>
            <figcaption className={[styles['animal-details__caption'], styles['animal-details__caption--empty']].join(' ')}>{description}</figcaption>
          </figure>
        </section>
      )
    }
}