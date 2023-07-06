import { createSlice } from '@reduxjs/toolkit';

const animals: AnimalData[][] = [];
const currentAnimals: AnimalData[] = [];
const basket: AnimalData[] = [];
const loggedIn = false;
const deletedAnimals: string[] = [];

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    animals: animals,
    currentAnimals: currentAnimals,
    selectedAnimal: null,
    currentPage: 0,
    basket: basket,
    loggedIn: loggedIn,
    loggedInUser: {},
    deleteAnimalModalData: { id: '', name: '', docID: '' },
    deletedAnimals: deletedAnimals,
    totalNumberOfAnimalsInDatabase: 0,
  },
  reducers: {
    updateDeletedAnimals(state, action) {
      state.deletedAnimals.push(action.payload.id);
    },
    updateCurrentAnimals(state) {
      if (!state.animals[state.currentPage]) {
        const currentPage = state.animals.length - 1 >= 0 ? state.animals.length - 1 : 0;
        state.currentPage = currentPage;
      }
      state.currentAnimals = state.animals[state.currentPage] || [];
    },
    setDeleteAnimalModalData(state, action) {
      state.deleteAnimalModalData = action.payload;
    },
    addAnimals(state, action) {
      state.animals.push(action.payload.animals);
    },
    resetAnimals(state) {
      state.animals = [];
    },
    setCurrentAnimals(state, action) {
      state.currentAnimals = state.animals[action.payload.page];
      state.currentPage = action.payload.page;
    },
    setSelectedAnimal(state, action) {
      state.selectedAnimal = action.payload.id;
    },
    setTotalNumberOfAnimalsInDatabase(state, action) {
      state.totalNumberOfAnimalsInDatabase = action.payload;
    },
    addAnimalToBasket(state, action) {
      state.basket.push(action.payload.id);
    },
    initBasket(state, action) {
      state.basket = action.payload.basket;
    },
    removeAnimalFromBasket(state, action) {
      const { id: idOfAnimalToRemoveFromBasket, removeAllInstances } = action.payload;

      if (removeAllInstances) {
        state.basket = state.basket.filter((animalID) => {
          return animalID !== idOfAnimalToRemoveFromBasket;
        });

        return;
      }

      const indexOfAnimalToRemove = state.basket.findIndex((animalID) => {
        return animalID === idOfAnimalToRemoveFromBasket;
      });

      if (indexOfAnimalToRemove === -1) {
        return;
      }

      state.basket.splice(indexOfAnimalToRemove, 1);
    },
    login(state, action) {
      state.loggedIn = true;
      state.loggedInUser = action.payload.user;
      localStorage.setItem('logged-in', 'true');
      localStorage.setItem('logged-in-user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.loggedIn = false;
      state.loggedInUser = {};
      localStorage.setItem('logged-in', 'false');
      localStorage.removeItem('logged-in-user');
    }
  }
});

export { animalsSlice };
