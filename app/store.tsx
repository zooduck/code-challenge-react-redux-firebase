import { configureStore } from "@reduxjs/toolkit";
// import { createSlice } from "@reduxjs/toolkit";
import { animalsSlice } from "./animalsSlice";

// const animalsSlice = createSlice({
//   name: 'animals',
//   initialState: {
//     animals: [
//       { id: 0, name: 'cow', type: 'mammal', description: 'a cow', selected: true },
//       { id: 1, name: 'hippo', type: 'mammal', description: 'a hippo', selected: false },
//       { id: 2, name: 'frog', type: 'amphibian', description: 'a frog', selected: false },
//       { id: 3, name: 'mouse', type: 'rodent', description: 'a mouse', selected: false },
//       { id: 4, name: 'gecko', type: 'reptile', description: 'a gecko', selected: false },
//       { id: 5, name: 'crocodile', type: 'reptile', description: 'a crocodile', selected: false },
//     ]
//   },
//   // reducers: {
//   //   animalAdd() {},
//   //   animalSelect() {}
//   // }
//   reducers: {
//     animalAdd(state, action) {
//       state.animals.push({
//         id: state.animals.length,
//         name: action.payload.name,
//         type: action.payload.type,
//         description: action.payload.description,
//         selected: false
//       })
//     },
//     animalSelect(state, action) {
//       state.animals.forEach((animal) => {
//         animal.selected = animal.id === action.payload.id
//       })
//     }
//   }
// })

// export const { animalAdd, animalSelect } = animalsSlice.actions;

// export { animalsSlice };

// export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
  reducer: animalsSlice.reducer
});
