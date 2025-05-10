const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger');
const Destination = require('../models/Destination');

dotenv.config();

const initialData = [
  // Original entries

  {
    name: "Paris",
    country: "France",
    clues: [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art."
    ],
    funFacts: [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
    ],
    trivia: [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia."
    ],
    options: ["Paris", "London", "Rome", "Berlin"] // Adding some options for the game
  },
  {
    name: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming."
    ],
    funFacts: [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
    ],
    trivia: [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies."
    ],
    options: ["Tokyo", "Seoul", "Shanghai", "Bangkok"]
  },
  {
    name: "New York",
    country: "USA",
    clues: [
      "Home to a green statue gifted by France in the 1800s.",
      "Nicknamed 'The Big Apple' and known for its Broadway theaters."
    ],
    funFacts: [
      "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
      "Times Square was once called Longacre Square before being renamed in 1904."
    ],
    trivia: [
      "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
      "The Empire State Building has its own zip code: 10118."
    ],
    options: ["New York", "Chicago", "Los Angeles", "Toronto"]
  },
  // Europe
  {
    name: "London",
    country: "United Kingdom",
    clues: [
      "This city's famous clock tower is often mistakenly called by the name of its bell.",
      "Home to the world's oldest underground railway system."
    ],
    funFacts: [
      "The city's underground system is known as 'The Tube' and carries over 5 million passengers daily!",
      "Ravens are kept at this city's historic tower due to an ancient superstition."
    ],
    trivia: [
      "The Great Fire of 1666 destroyed 80% of this city.",
      "This city has been the setting for countless Jack the Ripper tours."
    ],
    options: ["London", "Paris", "Dublin", "Edinburgh"]
  },
  {
    name: "Rome",
    country: "Italy",
    clues: [
      "This eternal city was built on seven hills.",
      "Home to the world's smallest country within its borders."
    ],
    funFacts: [
      "About €3,000 worth of coins are thrown into its famous fountain every day!",
      "It has over 2000 fountains, more than any other city in the world."
    ],
    trivia: [
      "The Colosseum could hold up to 50,000-80,000 spectators in its prime.",
      "The city has over 900 churches."
    ],
    options: ["Rome", "Venice", "Florence", "Milan"]
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    clues: [
      "This city has more bicycles than people.",
      "Famous for its narrow houses and numerous canals."
    ],
    funFacts: [
      "There are over 1,500 bridges in this city!",
      "Many houses are tilted forward intentionally to avoid furniture damage during moving."
    ],
    trivia: [
      "The city is built entirely on wooden poles.",
      "It has more canals than Venice."
    ],
    options: ["Amsterdam", "Rotterdam", "Copenhagen", "Brussels"]
  },
  // Asia
  {
    name: "Singapore",
    country: "Singapore",
    clues: [
      "This city-state is known as the 'Lion City'.",
      "Home to the world's first night safari zoo."
    ],
    funFacts: [
      "Chewing gum is banned in this clean and green city!",
      "It has the world's highest infinity pool."
    ],
    trivia: [
      "The national language is Malay, but English is most commonly used.",
      "It's one of only three city-states in the world."
    ],
    options: ["Singapore", "Kuala Lumpur", "Jakarta", "Bangkok"]
  },
  {
    name: "Dubai",
    country: "UAE",
    clues: [
      "Home to the world's tallest building.",
      "This city has artificial islands shaped like palm trees."
    ],
    funFacts: [
      "The police force here uses supercars like Lamborghinis!",
      "It has the world's first 7-star hotel."
    ],
    trivia: [
      "25% of the world's cranes were once located in this city during its construction boom.",
      "It has the world's largest choreographed fountain system."
    ],
    options: ["Dubai", "Abu Dhabi", "Doha", "Riyadh"]
  },
  // Americas
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    clues: [
      "This city is watched over by a giant statue on a mountain.",
      "Home to the world's largest Carnival celebration."
    ],
    funFacts: [
      "The famous statue here weighs 635 metric tons!",
      "Its name means 'River of January' in Portuguese."
    ],
    trivia: [
      "It was once the capital of Portugal - the only European capital outside of Europe.",
      "The city's famous beach is over 4km long."
    ],
    options: ["Rio de Janeiro", "São Paulo", "Buenos Aires", "Lima"]
  },
  {
    name: "Mexico City",
    country: "Mexico",
    clues: [
      "This city was built on a lake.",
      "Home to the only royal castle in North America."
    ],
    funFacts: [
      "The city is sinking at a rate of about 10 inches per year!",
      "It has the largest number of museums in the world."
    ],
    trivia: [
      "The ancient city it was built upon was once one of the largest in the world.",
      "It's the oldest capital city in the Americas."
    ],
    options: ["Mexico City", "Guadalajara", "Monterrey", "Cancún"]
  },
  // Australia/Oceania
  {
    name: "Sydney",
    country: "Australia",
    clues: [
      "This city's famous opera house was inspired by orange segments.",
      "Home to the world's largest natural harbor."
    ],
    funFacts: [
      "The Opera House has over one million roof tiles!",
      "Its Harbour Bridge is nicknamed 'The Coathanger' due to its shape."
    ],
    trivia: [
      "It was founded as a penal colony in 1788.",
      "Bondi Beach is one of the most famous beaches in the world."
    ],
    options: ["Sydney", "Melbourne", "Brisbane", "Perth"]
  },
  // Africa
  {
    name: "Cairo",
    country: "Egypt",
    clues: [
      "This city is home to the only remaining ancient wonder of the world.",
      "The world's longest river runs through it."
    ],
    funFacts: [
      "It's the largest city in the Arab world!",
      "The city's name means 'The Victorious' in Arabic."
    ],
    trivia: [
      "It's home to the oldest music institute in the Arab world.",
      "The city has been continuously inhabited for over 6,000 years."
    ],
    options: ["Cairo", "Alexandria", "Luxor", "Aswan"]
  },
  {
    name: "Cape Town",
    country: "South Africa",
    clues: [
      "This city sits beneath a famous flat-topped mountain.",
      "Home to the world's largest colony of African penguins."
    ],
    funFacts: [
      "Table Mountain has over 2,200 species of plants!",
      "It's home to the world's largest individually timed cycle race."
    ],
    trivia: [
      "It was the first city in Africa to get electricity.",
      "The castle here is the oldest surviving building in South Africa."
    ],
    options: ["Cape Town", "Johannesburg", "Durban", "Pretoria"]
  },
  {
    name: "Barcelona",
    country: "Spain",
    clues: [
      "This city is famous for its colorful architecture and the works of Gaudí.",
      "Its football team plays at the iconic Camp Nou stadium."
    ],
    funFacts: [
      "The Sagrada Família has been under construction since 1882!",
      "Barcelona has 9 UNESCO World Heritage Sites."
    ],
    trivia: [
      "Las Ramblas is one of the most famous streets here.",
      "This city hosted the 1992 Summer Olympics."
    ],
    options: ["Barcelona", "Madrid", "Valencia", "Seville"]
  },
  {
    name: "Vienna",
    country: "Austria",
    clues: [
      "Known as the 'City of Music' and home to classical composers.",
      "Famous for its coffee houses and imperial palaces."
    ],
    funFacts: [
      "The Vienna Philharmonic New Year's concert is broadcast globally.",
      "Vienna has been ranked as the world's most livable city multiple times."
    ],
    trivia: [
      "This city was the center of the Habsburg Empire.",
      "You can ride the giant Ferris wheel at Prater Park."
    ],
    options: ["Vienna", "Salzburg", "Zurich", "Prague"]
  },
  {
    name: "Lisbon",
    country: "Portugal",
    clues: [
      "Built on seven hills, this city has stunning views and vintage trams.",
      "A major earthquake reshaped this city in 1755."
    ],
    funFacts: [
      "The Bertrand Bookstore here is the oldest operating bookstore in the world.",
      "It’s the westernmost capital city in mainland Europe."
    ],
    trivia: [
      "This city is known for Fado music and custard tarts.",
      "Its iconic yellow Tram 28 is popular with tourists."
    ],
    options: ["Lisbon", "Porto", "Madrid", "Barcelona"]
  },
  {
    name: "Prague",
    country: "Czech Republic",
    clues: [
      "This city features an astronomical clock that dates back to 1410.",
      "Nicknamed the 'City of a Hundred Spires'."
    ],
    funFacts: [
      "The Charles Bridge is lined with 30 baroque statues.",
      "Its castle complex is the largest ancient castle in the world."
    ],
    trivia: [
      "This city was mostly untouched during World War II.",
      "It has a long-standing beer culture — some of the best lagers in the world!"
    ],
    options: ["Prague", "Vienna", "Budapest", "Kraków"]
  },
  {
    name: "Edinburgh",
    country: "Scotland",
    clues: [
      "A castle sits atop an extinct volcano in this historic city.",
      "Famous for the Fringe Festival, the world's largest arts festival."
    ],
    funFacts: [
      "J.K. Rowling wrote parts of Harry Potter in cafes here.",
      "The Old and New Towns are UNESCO World Heritage Sites."
    ],
    trivia: [
      "The Royal Mile connects a castle to a royal palace.",
      "Arthur’s Seat is a popular hike with panoramic views."
    ],
    options: ["Edinburgh", "Glasgow", "Dublin", "Belfast"]
  },
  {
    name: "Florence",
    country: "Italy",
    clues: [
      "Birthplace of the Renaissance and home to Michelangelo's David.",
      "Famous for its art museums and the Duomo cathedral."
    ],
    funFacts: [
      "The entire city center is a UNESCO World Heritage Site.",
      "It was once the capital of the Kingdom of Italy (1865–1871)."
    ],
    trivia: [
      "This city sits in the Tuscany region of central Italy.",
      "The Medici family ruled here for centuries."
    ],
    options: ["Florence", "Rome", "Venice", "Naples"]
  },
  {
    name: "Istanbul",
    country: "Turkey",
    clues: [
      "This city spans two continents: Europe and Asia.",
      "Home to the Hagia Sophia and Blue Mosque."
    ],
    funFacts: [
      "Formerly known as Byzantium and Constantinople.",
      "It's not the capital, but it's Turkey's largest city."
    ],
    trivia: [
      "The Grand Bazaar here is one of the largest covered markets in the world.",
      "Straddles the Bosphorus Strait."
    ],
    options: ["Istanbul", "Ankara", "Athens", "Cairo"]
  },
  {
    name: "Budapest",
    country: "Hungary",
    clues: [
      "This city is split by the Danube into Buda and Pest.",
      "Known for its thermal baths and Parliament building."
    ],
    funFacts: [
      "It has the largest synagogue in Europe.",
      "Chain Bridge connects the hilly Buda and flat Pest."
    ],
    trivia: [
      "The city’s name came after the unification of Buda, Pest, and Óbuda in 1873.",
      "The metro system is one of the oldest in the world."
    ],
    options: ["Budapest", "Vienna", "Prague", "Bucharest"]
  },
  {
    name: "Copenhagen",
    country: "Denmark",
    clues: [
      "Famous for its Little Mermaid statue and colorful Nyhavn harbor.",
      "The capital of the world’s happiest country."
    ],
    funFacts: [
      "The city aims to be carbon-neutral by 2025.",
      "Tivoli Gardens inspired Walt Disney."
    ],
    trivia: [
      "Bicycles outnumber cars in this city.",
      "It’s home to one of the oldest monarchies in the world."
    ],
    options: ["Copenhagen", "Oslo", "Stockholm", "Helsinki"]
  },

];

async function seedDatabase() {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB successfully');

    // Clear existing data
    await Destination.deleteMany({});
    logger.info('Cleared existing destinations');

    // Insert new data
    const destinations = await Destination.insertMany(initialData);
    logger.info(`Successfully seeded ${destinations.length} destinations`);

    // Log the inserted data
    destinations.forEach(dest => {
      logger.info('Inserted destination:', {
        name: dest.name,
        country: dest.country,
        numberOfClues: dest.clues.length,
        numberOfFunFacts: dest.funFacts.length
      });
    });

  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
}

seedDatabase();
