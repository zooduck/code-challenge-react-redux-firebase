import { getAnimalsFromDBWithPagination, getTotalNumberOfAnimalsInDatabase } from "@/app/firebase";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { animalsSlice } from "@/app/animalsSlice";

const { addAnimals, setCurrentAnimals, setSelectedAnimal, setTotalNumberOfAnimalsInDatabase } = animalsSlice.actions;

export function InitAnimals(props: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    const getAnimals = async () => {
      const animals = await getAnimalsFromDBWithPagination();
      const totalNumberOfAnimalsInDatabase = await getTotalNumberOfAnimalsInDatabase();
      dispatch(addAnimals({ animals: animals }));
      dispatch(setCurrentAnimals({ page: 0 }));
      dispatch(setSelectedAnimal({ id: animals[0].id }));
      dispatch(setTotalNumberOfAnimalsInDatabase(totalNumberOfAnimalsInDatabase));
    };
    getAnimals();
  }, [dispatch]);

  return (
    props.children
  )
}