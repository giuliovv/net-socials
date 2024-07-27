// src/utils/constants.js
import { slugify } from './slugify';

export const locations = [
  {
    id: slugify('Wimbledon Park'),
    name: 'Wimbledon Park',
    image: '/images/wimbledon-park.webp',
    coordinates: { x: 20, y: 80 },
    price: 4,
    capacity: 24,
  },
  {
    id: slugify("Regent's Park"),
    name: "Regent's Park",
    image: '/images/regents-park.jpg',
    coordinates: { x: 50, y: 40 },
    price: 4,
    capacity: 24,
  },
  {
    id: slugify('Hyde Park'),
    name: 'Hyde Park',
    image: '/images/hyde-park.jpg',
    coordinates: { x: 45, y: 50 },
    price: 4,
    capacity: 24,
  },
  {
    id: slugify("Clapham Commons"),
    name: "Clapham Commons",
    image: '/images/queens-club.jpg',
    coordinates: { x: 30, y: 60 },
    price: 4,
    capacity: 60,
  },
];
