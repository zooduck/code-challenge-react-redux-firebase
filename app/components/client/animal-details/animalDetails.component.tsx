import { useSelector } from 'react-redux';
import Image from 'next/image';
import styles from './animalDetails.module.css';
import { useRef, useEffect } from 'react';

export function AnimalDetails() {
  const data: any = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; }) => {
    return state.animals.flat().find((animal) => {
      return animal.id === state.selectedAnimal;
    }) || {};
  });

  const { name, description, image_url, image_width, image_height } = data;
  const imageSrc = `/${image_url}`;
  const animalDetailsSection: any = useRef(null);

  useEffect(() => {
    animalDetailsSection.current?.scrollIntoView();
  }, [data]);

  if (name && description) {
    return (
      <section className={styles['animal-details']} ref={animalDetailsSection}>
      <h1 className={styles['animal-details__heading']}>{name}</h1>
      <figure className={styles['animal-details__figure']}>
        <Image
          className={styles['animal-details__image']}
          src={imageSrc}
          alt={name}
          priority={name === 'cow'}
          width={image_width}
          height={image_height}/>
        <figcaption className={styles['animal-details__caption']}>{description}</figcaption>
      </figure>
    </section>
    )
  } else {
    return (
      <section className={styles['animal-details']}>
        <h1 className={[styles['animal-details__heading'], styles['animal-details__heading--empty']].join(' ')}></h1>
        <figure className={styles['animal-details__figure']}>
          <section className={styles['animal-details__image-placeholder']}></section>
          <figcaption className={[styles['animal-details__caption'], styles['animal-details__caption--empty']].join(' ')}>{description}</figcaption>
        </figure>
      </section>
    )
  }
}
