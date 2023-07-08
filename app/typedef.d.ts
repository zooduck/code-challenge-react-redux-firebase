type AnimalData = {
  docID: string;
  id: string;
  name: string;
  type: string;
  description: string;
  image_url: string;
  image_height: number;
  image_width: number;
  selected?: boolean
}

type AnimalDetail = {
  id: string;
  name: string;
  type: string;
  description: string;
  image_url: string;
}