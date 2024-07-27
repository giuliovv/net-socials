// src/utils/constants.js
import { slugify } from './slugify';

export const locations = [
  {
    id: slugify('Wimbledon Park'),
    name: 'Wimbledon Park',
    image: '/images/wimbledon-park.webp',
    coordinates: { x: 20, y: 80 },
    link: "https://www.tickettailor.com/events/netsocials/1324515",
    price: 4,
    capacity: 60,
  },
  {
    id: slugify("Regent's Park"),
    name: "Regent's Park",
    image: '/images/regents-park.jpg',
    coordinates: { x: 50, y: 40 },
    link: "https://www.tickettailor.com/events/netsocials/1324515",
    price: 4,
    capacity: 60,
  },
  {
    id: slugify('Hyde Park'),
    name: 'Hyde Park',
    image: '/images/hyde-park.jpg',
    coordinates: { x: 45, y: 50 },
    link: "https://www.tickettailor.com/events/netsocials/1324515",
    price: 4,
    capacity: 60,
  },
  {
    id: slugify("Queen's Club"),
    name: "Queen's Club",
    image: '/images/queens-club.jpg',
    coordinates: { x: 30, y: 60 },
    link: "https://www.tickettailor.com/events/netsocials/1324515",
    price: 4,
    capacity: 60,
  },
];
