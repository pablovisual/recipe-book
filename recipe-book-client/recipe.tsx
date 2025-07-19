//import pizza from '../public/healthy-pizza.jpg';
//import {StaticImageData} from "next/image";

interface recipe {
  id: number;
  time: string;
  title: string;
  ingredients: string;
  description: string;
  picture: string;
}

const recipes: recipe[] = [
  {
    id: 1,
    title: "cookie",
    time: '3 hours 20 minutes',
    ingredients: "food food",
    description: "This how you make cookie",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 2,
    time: '3 hours 20 minutes',
    title: "cheese",
    ingredients: "food food",
    description: "get milk and stuff",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 3,
    time: '3 hours 20 minutes',
    title: "pizza",
    ingredients: "food food",
    description: "cheese, sauce, pepperoni, dough",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 4,
    time: '3 hours 20 minutes',
    title: "chili dog",
    ingredients: "food food",
    description: "chili, hotdog, mustard, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 5,
    time: '3 hours 20 minutes',
    title: "muffin",
    ingredients: "food food",
    description: "milk, egg, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 6,
    time: '3 hours 20 minutes',
    title: "Chorrizo Hamburger",
    ingredients: "food food",
    description: "bread, mustard, chorrizo, meat patty, pickles, lettuce",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 7,
    time: '3 hours 20 minutes',
    title: "chili dog",
    ingredients: "food food",
    description: "chili, hotdog, mustard, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 8,
    time: '3 hours 20 minutes',
    title: "muffin",
    ingredients: "food food",
    description: "milk, egg, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 9,
    time: '3 hours 20 minutes',
    title: "chili dog",
    ingredients: "food food",
    description: "chili, hotdog, mustard, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 10,
    time: '3 hours 20 minutes',
    title: "muffin",
    ingredients: "food food",
    description: "milk, egg, bread",
    picture: '/healthy-pizza.jpg'
  },
]

export default recipes;