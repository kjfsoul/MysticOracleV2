export interface LuckRitual {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: "prosperity" | "love" | "protection" | "health" | "creativity";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string; // e.g., "5 min", "30 min", "2 hours"
  materials: string[];
  steps: string[];
  description: string;
  fullDescription: string;
  imageUrl: string;
  videoUrl?: string;
  moonPhase?: "new" | "waxing" | "full" | "waning";
  element?: "fire" | "water" | "air" | "earth" | "spirit";
  createdAt: string;
  featured: boolean;
}

export const luckRituals: LuckRitual[] = [
  {
    id: "1",
    title: "Bay Leaf Wish Ritual",
    subtitle: "Ancient technique for manifestation and abundance",
    slug: "bay-leaf-wish-ritual",
    category: "prosperity",
    difficulty: "beginner",
    duration: "15 min",
    materials: [
      "Dried bay leaves",
      "Pen or pencil",
      "Fireproof dish",
      "Matches or lighter",
      "Optional: gold or green candle"
    ],
    steps: [
      "Find a quiet space where you won't be disturbed.",
      "Take a bay leaf and hold it in your hands. Close your eyes and take three deep breaths to center yourself.",
      "Write your wish or intention clearly on the bay leaf with a pen or pencil. Be specific but concise.",
      "If using a candle, light it and set your intention for prosperity.",
      "Focus on your wish and visualize it already manifested as you light the bay leaf.",
      "Place the burning leaf in the fireproof dish and let it burn completely.",
      "As it burns, say: 'As this bay leaf burns, my wish begins to manifest. It is done.'"
    ],
    description: "The Bay Leaf Wish Ritual is an ancient practice used across cultures to manifest desires. The aromatic properties of bay leaf are believed to carry wishes to the universe, while the act of burning releases your intention.",
    fullDescription: "The Bay Leaf Wish Ritual is an ancient practice used across cultures from Ancient Greece to modern folk magic to manifest desires and attract prosperity. The aromatic properties of bay leaf are believed to carry wishes to the universe, while the act of burning releases your intention.\n\nBay leaves have been used in magical and spiritual practices for centuries. The Ancient Greeks considered the bay laurel sacred to Apollo, and priestesses would chew bay leaves to receive prophetic visions. In modern magical practice, bay leaves are associated with wishes, prosperity, protection, and success.\n\nThis simple yet powerful ritual works through the combination of focused intention, symbolic action, and the release of that intention to the universe. As the bay leaf burns, it transforms your written wish from the physical realm to the ethereal, symbolizing the journey your desire takes from thought to manifestation.",
    imageUrl: "https://images.unsplash.com/photo-1620733723572-11c53fc809a9?q=80&w=2786&auto=format&fit=crop",
    moonPhase: "waxing",
    element: "fire",
    createdAt: "2025-03-01T10:30:00Z",
    featured: true
  },
  {
    id: "2",
    title: "Cinnamon Attraction Spell",
    subtitle: "Spice up your love life with this sweet ritual",
    slug: "cinnamon-attraction-spell",
    category: "love",
    difficulty: "beginner",
    duration: "10 min",
    materials: [
      "Cinnamon sticks or powder",
      "Pink or red candle",
      "Matches or lighter",
      "Small piece of paper",
      "Red pen"
    ],
    steps: [
      "Light the pink or red candle to create sacred space.",
      "On the small paper, write down the qualities you desire in a partner or relationship (not a specific person).",
      "Fold the paper three times toward you to draw the energy inward.",
      "Sprinkle cinnamon in a circle around the folded paper while saying: 'Sweet as cinnamon, love comes in. Open my heart to let love begin.'",
      "Allow the candle to burn safely for at least 15 minutes as you visualize love entering your life.",
      "Keep the paper under your pillow for seven nights."
    ],
    description: "Cinnamon has been used in love spells for centuries due to its warming properties and sweet aroma. This simple ritual helps attract loving energy and open your heart to new romantic possibilities.",
    fullDescription: "Cinnamon has been used in love spells and attraction rituals for centuries due to its warming properties and sweet, enticing aroma. This spice is associated with passion, success, and abundance across many magical traditions.\n\nIn ancient Egypt, cinnamon was more valuable than gold and was used in love potions and perfumes. In modern magical practice, it's considered one of the most powerful ingredients for drawing love, prosperity, and success.\n\nThis simple ritual helps attract loving energy and open your heart to new romantic possibilities. The key to its effectiveness lies in being clear about the qualities you desire in a relationship rather than focusing on a specific person, which respects the free will of others.\n\nThe circular pattern of the cinnamon represents the continuous flow of love in your life, while the act of folding the paper toward you symbolizes drawing that energy to yourself. Sleeping with your intention under your pillow allows your subconscious mind to work on manifesting your desire even as you sleep.",
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=2832&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    moonPhase: "full",
    element: "fire",
    createdAt: "2025-03-05T14:15:00Z",
    featured: false
  },
  {
    id: "3",
    title: "Full Moon Water Charging",
    subtitle: "Harness lunar energy for magical purposes",
    slug: "full-moon-water-charging",
    category: "creativity",
    difficulty: "beginner",
    duration: "overnight",
    materials: [
      "Clear glass jar with lid",
      "Spring or filtered water",
      "Optional: crystals like clear quartz or moonstone",
      "Optional: herbs like lavender or jasmine"
    ],
    steps: [
      "Fill the glass jar with spring or filtered water.",
      "If using, add crystals or herbs to enhance the intended properties.",
      "Set your intention for the water by holding the jar and speaking your purpose aloud.",
      "Place the jar where it will receive direct moonlight during the full moon.",
      "Leave overnight, from dusk until dawn.",
      "In the morning, thank the moon for charging your water.",
      "Store in a cool place and use within one week for spells, ritual cleansing, or plants."
    ],
    description: "Full Moon Water is a simple yet powerful magical tool charged with lunar energy. It can be used in rituals, spells, cleansing practices, or even to water plants that correspond with your magical intentions.",
    fullDescription: "Full Moon Water is a simple yet powerful magical tool charged with the potent energy of the moon at its fullest phase. This practice draws on the ancient association between the moon and water - both connected to emotions, intuition, psychic abilities, and the subconscious mind.\n\nAcross magical traditions, the full moon represents completion, fulfillment, and the height of power. Water, as a receptor element, easily absorbs and holds the moon's energy, creating a versatile magical ingredient.\n\nThe practice of creating moon-charged water appears in various forms across cultures, from ancient lunar goddess worship to modern witchcraft. The water becomes a vessel for lunar energy that you can later use in your magical practice.\n\nThis full moon water can be used for a variety of magical purposes: as an ingredient in potions or spells, to cleanse magical tools or spaces, to anoint yourself before divination practice, or even to water plants that correspond with your magical intention.\n\nFor creativity specifically, full moon water helps dissolve creative blocks, enhance intuition, and connect you with the flow of inspiration. Adding crystals like amethyst or herbs like mugwort can further enhance these creative properties.",
    imageUrl: "https://images.unsplash.com/photo-1502239608882-93b729c6af43?q=80&w=2940&auto=format&fit=crop",
    moonPhase: "full",
    element: "water",
    createdAt: "2025-03-07T20:45:00Z",
    featured: false
  },
  {
    id: "4",
    title: "Protective Salt Boundary",
    subtitle: "Ancient method for creating sacred space",
    slug: "protective-salt-boundary",
    category: "protection",
    difficulty: "beginner",
    duration: "20 min",
    materials: [
      "Sea salt or himalayan salt",
      "Small bowl",
      "Optional: protective herbs like rosemary or sage",
      "Optional: black or white candle"
    ],
    steps: [
      "If using herbs, mix them with the salt in the bowl.",
      "If using a candle, light it and set your intention for protection.",
      "Starting at your main entrance, walk clockwise around your home.",
      "Sprinkle a thin line of salt along thresholds, windowsills, and doorways.",
      "As you do this, visualize a shield of protective light forming.",
      "Say: 'With this salt, I create a boundary. Only love and light may enter here.'",
      "When you complete the circle, return to where you started."
    ],
    description: "Salt has been used as a protective substance across cultures for millennia. This simple ritual creates an energetic boundary around your home that helps repel negative energies while maintaining a sanctuary for positive ones.",
    fullDescription: "Salt has been used as a protective substance across cultures for millennia. From ancient Rome where salt was used to consecrate sacred spaces, to Japanese Shinto tradition where salt (shio) purifies and wards off evil, to modern magical practices where it forms protective barriers, salt stands as a universal symbol of purity and protection.\n\nThis simple ritual creates an energetic boundary around your home that helps repel negative energies while maintaining a sanctuary for positive ones. The circular, clockwise motion used in the ritual is significant as it follows the path of the sun, associated with positive energy and banishing darkness.\n\nSea salt is particularly potent for magical use as it contains the elemental properties of both water and earth, making it doubly grounding and purifying. When combined with protective herbs like rosemary (mental clarity and protection), sage (cleansing), or bay leaves (victory over negative forces), the salt boundary becomes even more powerful.\n\nThe boundary created isn't just physical - as you lay the salt, your intention creates an energetic shield that surrounds your space. This protection typically lasts until the salt is physically removed, though many practitioners choose to renew their salt boundaries during the new moon or at the change of seasons.",
    imageUrl: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=2940&auto=format&fit=crop",
    moonPhase: "new",
    element: "earth",
    createdAt: "2025-03-09T11:20:00Z",
    featured: true
  },
  {
    id: "5",
    title: "Crystal Grid for Abundance",
    subtitle: "Geometric energy pattern for manifesting prosperity",
    slug: "crystal-grid-abundance",
    category: "prosperity",
    difficulty: "intermediate",
    duration: "45 min",
    materials: [
      "Center stone: Clear Quartz point or Citrine",
      "Inner circle: 6 Green Aventurine stones",
      "Outer circle: 12 small Pyrite or Tiger's Eye stones",
      "Flower of Life pattern (printed or drawn)",
      "Green candle",
      "Sage or Palo Santo for cleansing"
    ],
    steps: [
      "Cleanse your space and crystals with sage or palo santo.",
      "Place your Flower of Life pattern on a flat surface.",
      "Light the green candle and set your intention for abundance.",
      "Place your center stone in the middle of the pattern.",
      "Arrange the 6 Aventurine stones in a circle around the center.",
      "Create an outer circle with the 12 smaller stones.",
      "Activate the grid by touching each crystal with your finger or a quartz wand, starting from the outer circle and moving inward.",
      "Finally, touch the center stone and state your intention aloud."
    ],
    description: "Crystal grids combine sacred geometry with the energetic properties of crystals to amplify intentions. This abundance grid creates a powerful energy field that helps attract prosperity, success, and opportunity into your life.",
    fullDescription: "Crystal grids combine sacred geometry with the energetic properties of crystals to create a synergistic effect that amplifies intentions. This ancient practice has roots in various traditions from Egyptian ceremonies to Native American medicine wheels to modern crystal healing.\n\nThe power of a crystal grid comes from the precise geometric arrangement of stones, creating energy pathways that multiply and focus the properties of each individual crystal. The Flower of Life pattern, one of the most ancient and sacred geometric patterns, serves as the foundation for this grid, representing the interconnected nature of abundance and prosperity.\n\nEach crystal in this grid serves a specific purpose:\n\n- The center Clear Quartz or Citrine acts as the power source and intention holder. Quartz amplifies energy while Citrine specifically attracts abundance and success.\n\n- Green Aventurine in the inner circle promotes opportunity, luck, and financial growth.\n\n- Pyrite or Tiger's Eye in the outer circle provides protection for your prosperity and adds motivation to achieve your goals.\n\nWhen activated, this grid creates a powerful energy field that helps attract prosperity, success, and opportunity into your life. The grid can remain in place for as long as you're working toward your abundance goals, though many practitioners recommend refreshing the energy every full moon by cleansing the crystals and reactivating the grid.\n\nFor maximum effectiveness, place your abundance grid in your home office, near your workspace, or in the southeast corner of your home (the wealth corner according to Feng Shui).",
    imageUrl: "https://images.unsplash.com/photo-1610025642832-a58305ecf72a?q=80&w=3087&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    element: "earth",
    createdAt: "2025-03-12T16:55:00Z",
    featured: true
  },
  {
    id: "6",
    title: "Rose Quartz Self-Love Bath",
    subtitle: "Sacred water ritual for healing the heart",
    slug: "rose-quartz-self-love-bath",
    category: "love",
    difficulty: "beginner",
    duration: "1 hour",
    materials: [
      "3-5 rose quartz crystals",
      "Pink Himalayan salt (1/2 cup)",
      "Dried rose petals",
      "Rose essential oil (5-7 drops)",
      "Pink or white candles",
      "Optional: rose or jasmine incense"
    ],
    steps: [
      "Cleanse your bathroom space with sound (bell or singing bowl) or incense.",
      "Fill the bathtub with warm water at a comfortable temperature.",
      "Add the pink salt while saying: 'I release all that no longer serves my highest good.'",
      "Add rose petals to the water, saying: 'I open my heart to divine love.'",
      "Add drops of essential oil, saying: 'I am worthy of love and compassion.'",
      "Place rose quartz around the tub (or in the water if they're large enough).",
      "Light the candles and dim the lights.",
      "Enter the bath and soak for at least 20 minutes, visualizing pink light healing your heart center."
    ],
    description: "This healing bath ritual combines the loving energy of rose quartz with the nurturing element of water to create a powerful self-love practice. Perfect for healing heartache or simply refilling your emotional reserves.",
    fullDescription: "This healing bath ritual combines the loving energy of rose quartz with the nurturing element of water to create a powerful self-love practice. Rose quartz has been used since ancient times as a heart healer and love attractor - the ancient Egyptians believed it prevented aging, while Greek and Roman myths associated the stone with Aphrodite/Venus, the goddess of love.\n\nWater has long been recognized across spiritual traditions as an element of emotional healing, purification, and renewal. When combined with intention, water becomes a powerful medium for energetic transformation.\n\nEach component of this bath ritual serves a specific purpose:\n\n- Rose quartz calms and soothes the heart chakra, dissolving emotional wounds and opening the heart to self-love.\n\n- Pink Himalayan salt cleanses your energy field, removing negative attachments and restoring mineralogical balance.\n\n- Rose petals and essential oil connect you to the frequency of love through their aroma and the flower's ancient association with the heart.\n\n- Candles create sacred space and represent the fire of transformation.\n\nThis bath ritual is perfect for healing after heartache, during times of emotional depletion, or simply as a regular practice to maintain heart chakra health. As you soak in the bath, you create a liminal space where healing can occur on multiple levels - physical, emotional, and spiritual.\n\nAfter your bath, wrap yourself in a warm towel and sit quietly for a few minutes to integrate the experience. You may wish to journal any insights that arose during the ritual. The rose quartz crystals can be dried and placed beside your bed to continue their healing influence.",
    imageUrl: "https://images.unsplash.com/photo-1654444459371-e85dedfd1ea7?q=80&w=2940&auto=format&fit=crop",
    moonPhase: "waxing",
    element: "water",
    createdAt: "2025-03-15T09:30:00Z",
    featured: false
  }
];

export function getFeaturedRituals(count: number = 3): LuckRitual[] {
  return luckRituals
    .filter(ritual => ritual.featured)
    .slice(0, count);
}

export function getRitualBySlug(slug: string): LuckRitual | undefined {
  return luckRituals.find(ritual => ritual.slug === slug);
}

export function getRitualsByCategory(category: string): LuckRitual[] {
  return luckRituals.filter(ritual => ritual.category === category);
}

export function getLatestRituals(count: number = 5): LuckRitual[] {
  return [...luckRituals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}