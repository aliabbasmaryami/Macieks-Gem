const idyllicNames = {
  animals: ["Dove", "Fawn", "Meadow", "Brook", "Willow", "Rabbit", "Fox", "Luna", "Lily", "Starling", "Sparrow", "Robin", "Blossom", "Whisper", "Honey", "Harmony", "Maple", "Cedar", "Juniper", "Petal", "Sunny", "Daisy", "Peach", "Breeze", "Pine", "River", "Grace", "Frost", "Cloud", "Feather", "Raindrop", "Pebble", "Moonbeam", "Cypress", "Echo", "Flora", "Tulip", "Raven", "Amber", "Dawn", "Misty", "Rose", "Ivy", "Lark", "Iris", "Poppy", "Aurora"],
  birds: ["Skylark", "Wren", "Goldfinch", "Swallow", "Falcon", "Sparrow", "Bluebird", "Cardinal", "Hummingbird", "Blackbird", "Woodpecker", "Starling", "Kingfisher", "Warbler", "Nightingale", "Mockingbird", "Cuckoo", "Pheasant", "Eagle", "Hawk", "Owl", "Duck", "Goose", "Pelican", "Crane", "Stork", "Seagull", "Albatross", "Swift", "Finch", "Vulture", "Parrot", "Peacock", "Flamingo", "Turkey", "Penguin", "Dove", "Raven", "Crow", "Toucan", "Swan", "Magpie", "Quail", "Robin", "Thrush", "Heron", "Oriole"],
  minerals: ["Amber", "Crystal", "Jade", "Jasper", "Opal", "Quartz", "Emerald", "Ruby", "Sapphire", "Diamond", "Topaz", "Agate", "Amethyst", "Garnet", "Moonstone", "Peridot", "Turquoise", "Aquamarine", "Malachite", "Lapis Lazuli", "Pearl", "Coral", "Onyx", "Obsidian", "Pyrite", "Celestite", "Aventurine", "Selenite", "Tiger's Eye", "Copper", "Gold", "Silver", "Amazonite", "Sunstone", "Zircon", "Beryl"],
  seasons: ["Blossom", "Harvest", "Mist", "Sunrise", "Sunset", "Twilight", "Dusk", "Dawn", "Spring", "Summer", "Autumn", "Winter", "Frost", "Breeze", "Rain", "Sunshine", "Moonlight", "Morning", "Evening", "Night", "Midnight", "Noon", "Daybreak", "Serenade", "Aurora", "Horizon", "Solstice", "Equinox", "Fog", "Dew", "Frost", "Storm", "Calm", "Winds", "Thunder", "Lightning", "Whirlwind", "Blizzard", "Chill", "Glow", "Firefly", "Crescent", "Starlight", "Lantern", "Constellation"],
	flowers: ["Rose", "Lily", "Daisy", "Sunflower", "Tulip", "Daffodil", "Poppy", "Peony", "Carnation", "Orchid", "Dahlia", "Cherry Blossom", "Hibiscus", "Lavender", "Azalea", "Magnolia", "Forget-Me-Not", "Lotus", "Chrysanthemum", "Jasmine", "Iris", "Marigold", "Snapdragon", "Aster", "Primrose", "Oak", "Elm"],
	fruits: ["Apple", "Banana", "Orange", "Strawberry", "Blueberry", "Raspberry", "Blackberry", "Pineapple", "Mango", "Peach", "Pear", "Plum", "Cherry", "Grapes", "Kiwi", "Watermelon", "Cantaloupe", "Honeydew", "Papaya", "Coconut", "Lemon", "Lime", "Grapefruit", "Apricot", "Nectarine", "Cranberry", "Fig", "Passionfruit", "Guava", "Pecan"],
  other: ["Dream", "Serene", "Tranquil", "Charm", "Peace", "Wish", "Gentle", "Serenade", "Tranquility", "Whisper", "Graceful", "Joy", "Bliss", "Wonder", "Enchantment", "Radiance", "Harmony", "Fable", "Fantasy", "Elysium", "Paradise", "Ethereal", "Zen", "Whimsy", "Luminous", "Nirvana", "Sylvan", "Cascade", "Aura", "Adventure", "Ridge", "Prairie"]
};
const helperWords = ["Love", "Crest", "Charm", "Sky", "Whisper", "Glimmer", "Tranquil", "Serenity", "Dream", "Mystic", "Gentle", "Enchanted", "Luminous", "Grace", "Harmony", "Radiant", "Radiance", "Ethereal", "Bliss", "Sylvan", "Calm", "Peace", "Twilight", "Serenade", "Sunny", "Fable", "Tranquility", "Glow", "Breeze", "Celestial", "Lullaby", "Zen", "Fantasy", "Aurora", "Elysium", "Paradise", "Soothing", "Whimsy", "Melody", "Eternal", "Wish", "Wonder", "Enchantment", "Cascade", "Aura", "Echo", "Fairy", "Halcyon"];

const streetTypes = ["Trail", "Lane", "Road", "Avenue", "Street", "Way", "Drive", "Court", "Circle", "Path", "Boulevard", "Plaza", "Terrace", "Place", "Square", "Parkway", "Alley", "Grove", "Ridge", "Crescent", "Loop", "Promenade", "Meadow", "Gardens", "Row", "Crossing", "Vista", "Valley"];

function generateStreetName() {
	const p = 0.1; // probability of helper being after the idyllic word
	const pp = 0.5; // probability of having a street type
  const categories = ["animals", "birds", "minerals", "seasons", "flowers", "fruits", "other"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const idyllic = idyllicNames[category][Math.floor(Math.random() * idyllicNames[category].length)];
  let streetName = idyllic;

  // Determine if the helper should be before or after the idyllic word
  const helperPlacement = Math.random() < p ? "before" : "after";
  const helper = helperWords[Math.floor(Math.random() * helperWords.length)];

  // Add helper based on placement
  if (helperPlacement === "before") {
    streetName = `${helper} ${streetName}`;
  } else {
    streetName = `${streetName} ${helper}`;
  }

  // Determine if a street type should be added
  if (Math.random() < pp) {
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    streetName = `${streetName} ${streetType}`;
  }
  return streetName;
}


function newStreet() {
	const streetSign = document.querySelector('.streetSign')
  streetSign.classList.add("changing");
  // change mid animation
	setTimeout(() => {
    streetSign.textContent = generateStreetName();
   }, 1000);
  streetSign.addEventListener("animationend", () => {
    // Remove the changing class once the animation ends
    streetSign.classList.remove("changing");
  }, { once: true });
}
document.querySelector('.streetSign').textContent = generateStreetName();

document.querySelector('.newStreet').addEventListener('click', newStreet);
document.querySelector('.streetSign').addEventListener('click', newStreet);
document.querySelector('.pole').addEventListener('click', newStreet);