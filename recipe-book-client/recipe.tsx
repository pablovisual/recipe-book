//import pizza from '../public/healthy-pizza.jpg';
//import {StaticImageData} from "next/image";

interface recipe {
    id: number;
    price: number;
    title: string;
    description: string;
    picture: string;
}

const recipes: recipe[] = [
    {
        id: 1,
        price: 2.00,
        title: "cookie",
        description: "This how you make cookie",
        picture: '/healthy-pizza.jpg'
    },

    {
        id: 2,
        price: 4.00,
        title: "cheese",
        description: "get milk and stuff",
        picture: '/healthy-pizza.jpg'
    },

    {
        id: 3,
        price: 10.00,
        title: "pizza",
        description: "cheese, sauce, pepperoni, dough",
        picture: '/healthy-pizza.jpg'
    },

    {
        id: 4,
        price: 5.00,
        title: "chili dog",
        description: "chili, hotdog, mustard, bread",
        picture: '/healthy-pizza.jpg'
    },

    {
        id: 5,
        price: 1.50,
        title: "muffin",
        description: "milk, egg, bread",
        picture: '/healthy-pizza.jpg'
    },

    {
        id: 6,
        price: 8.00,
        title: "Chorrizo Hamburger",
        description: "bread, mustard, chorrizo, meat patty, pickles, lettuce",
        picture: '/healthy-pizza.jpg'
    },

  {
    id: 7,
    price: 5.00,
    title: "chili dog",
    description: "chili, hotdog, mustard, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 8,
    price: 1.50,
    title: "muffin",
    description: "milk, egg, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 9,
    price: 5.00,
    title: "chili dog",
    description: "chili, hotdog, mustard, bread",
    picture: '/healthy-pizza.jpg'
  },

  {
    id: 10,
    price: 1.50,
    title: "muffin",
    description: "milk, egg, bread",
    picture: '/healthy-pizza.jpg'
  },
]

export default recipes;