'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { Animals } from './components/client/animals/animals.component';
import { InitAnimals } from './components/functional/init-animals/initAnimals.component';
import { AnimalDetails } from './components/client/animal-details/animalDetails.component'
import { AddAnimalForm } from './components/client/add-animal-form/addAnimalForm.component';
import { DeleteAnimalModal } from './components/client/delete-animal-modal/deleteAnimalModal.component';
import { Header } from './components/client/header/Header.component';

export default async function Home() {
  return (
    <Provider store={store}>
      <InitAnimals/>
      <main>
        <Header/>
        <Animals/>
        <AnimalDetails/>
        <AddAnimalForm/>
        <footer>Built with create-next-app using Next.js, React, Redux Toolkit and Firebase | 2023-06-05T05:20:56.837Z</footer>
      </main>
      <DeleteAnimalModal/>
    </Provider>
  )
}
