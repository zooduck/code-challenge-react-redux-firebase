import { getAnimalsFromDBWithPagination, getTotalNumberOfAnimalsInDatabase } from "@/app/firebase";
import { useDispatch } from 'react-redux';
import { animalsSlice } from "@/app/animalsSlice";
import { useEffect } from 'react';

const { initAnimals } = animalsSlice.actions;

export function InitAnimals(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAnimals = async () => {
      const animals = await getAnimalsFromDBWithPagination();
      const totalNumberOfAnimalsInDatabase = await getTotalNumberOfAnimalsInDatabase();
      dispatch(initAnimals({
        animals: animals,
        page: 0,
        id: animals[0].id,
        totalNumberOfAnimalsInDatabase: totalNumberOfAnimalsInDatabase
      }))
    };
    setTimeout(getAnimals, 1000);
  }, [dispatch])

  return (
    props.children
  )
}
