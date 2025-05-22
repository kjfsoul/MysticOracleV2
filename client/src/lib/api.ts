// Mock data for horoscopes when API is unavailable
const mockHoroscopes = {
  aries: {
    sign: "aries",
    date: new Date().toISOString().split("T")[0],
    content:
      "Today is a day of action and initiative for Aries. Your natural leadership abilities are heightened, making it an excellent time to take charge of projects or situations that require decisive action. Trust your instincts and move forward with confidence.",
    premium_content:
      "Mars, your ruling planet, forms a favorable aspect with Jupiter, amplifying your energy and expanding your opportunities. This cosmic alignment supports bold moves in career and personal projects. Your competitive edge is strong - use it wisely.",
  },
  taurus: {
    sign: "taurus",
    date: new Date().toISOString().split("T")[0],
    content:
      "Stability and comfort are highlighted for Taurus today. Focus on practical matters and take time to appreciate the simple pleasures in life. Your determination helps you make steady progress on long-term goals. Financial decisions made today have positive long-term effects.",
    premium_content:
      "Venus forms a harmonious aspect with Saturn, bringing a grounding energy to your relationships and financial matters. This is an excellent time for long-term planning and establishing solid foundations. Creative projects benefit from your enhanced attention to detail.",
  },
  gemini: {
    sign: "gemini",
    date: new Date().toISOString().split("T")[0],
    content:
      "Communication flows easily for Gemini today. Your natural curiosity leads to valuable discoveries and interesting conversations. It's a good day for networking, learning new information, or starting a writing project. Stay flexible to make the most of unexpected opportunities.",
    premium_content:
      "Mercury's alignment with Uranus brings flashes of brilliant insight and innovative ideas. Your mind is especially quick and receptive to new concepts. This is an excellent time for brainstorming sessions, technological endeavors, or breaking free from mental routines.",
  },
  cancer: {
    sign: "cancer",
    date: new Date().toISOString().split("T")[0],
    content:
      "Emotional awareness is heightened for Cancer today. Trust your intuition when making decisions, especially regarding home and family matters. Nurturing relationships bring satisfaction, and creating a comfortable environment helps you feel secure and centered.",
    premium_content:
      "The Moon forms a supportive aspect with Neptune, enhancing your intuitive abilities and emotional sensitivity. This cosmic influence is excellent for creative pursuits, spiritual practices, and deepening emotional connections with loved ones.",
  },
  leo: {
    sign: "leo",
    date: new Date().toISOString().split("T")[0],
    content:
      "Your natural charisma shines brightly today, Leo. Creative expression brings joy and recognition. Leadership opportunities arise where you can showcase your talents and inspire others. Take time to celebrate your achievements and share your warmth with those around you.",
    premium_content:
      "The Sun forms a powerful alignment with Mars, amplifying your confidence and creative energy. This cosmic boost supports bold self-expression and taking center stage. Romantic endeavors are especially favored, with opportunities for passionate connections.",
  },
  virgo: {
    sign: "virgo",
    date: new Date().toISOString().split("T")[0],
    content:
      "Attention to detail serves you well today, Virgo. Your analytical skills help solve complex problems efficiently. Health and wellness routines bring positive results when approached methodically. Small improvements to your daily systems create significant long-term benefits.",
    premium_content:
      "Mercury, your ruling planet, forms a harmonious aspect with Saturn, bringing mental clarity and practical thinking. This cosmic alignment supports detailed planning, research, and organizational tasks. Your ability to communicate complex information is enhanced.",
  },
  libra: {
    sign: "libra",
    date: new Date().toISOString().split("T")[0],
    content:
      "Harmony and balance are highlighted for Libra today. Relationships flourish with open communication and compromise. Your diplomatic skills help resolve conflicts among friends or colleagues. Aesthetic appreciation brings joy - surround yourself with beauty and art.",
    premium_content:
      "Venus, your ruling planet, forms a beautiful aspect with Jupiter, expanding your social opportunities and enhancing relationships. This cosmic blessing brings harmony to partnerships and potential for new romantic connections. Creative collaborations are especially favored.",
  },
  scorpio: {
    sign: "scorpio",
    date: new Date().toISOString().split("T")[0],
    content:
      "Intensity and focus characterize your day, Scorpio. Your investigative nature uncovers valuable insights and hidden information. Transformative experiences offer opportunities for personal growth. Trust your instincts regarding other people's motives and intentions.",
    premium_content:
      "Pluto forms a powerful aspect with Mars, intensifying your determination and regenerative abilities. This cosmic alignment supports deep research, psychological understanding, and transformative processes. Your magnetic presence is especially strong today.",
  },
  sagittarius: {
    sign: "sagittarius",
    date: new Date().toISOString().split("T")[0],
    content:
      "Adventure and expansion call to you today, Sagittarius. Learning opportunities broaden your horizons and inspire optimism. Travel plans or educational pursuits receive favorable support. Your philosophical outlook helps others gain perspective on their challenges.",
    premium_content:
      "Jupiter, your ruling planet, forms an expansive aspect with Mercury, enhancing your mental exploration and communication skills. This cosmic blessing supports travel planning, educational endeavors, and publishing projects. Your ability to inspire others is magnified.",
  },
  capricorn: {
    sign: "capricorn",
    date: new Date().toISOString().split("T")[0],
    content:
      "Discipline and structure bring success today, Capricorn. Professional goals advance through persistent effort and strategic planning. Your practical approach to challenges earns respect from colleagues. Long-term investments of time and resources show promising returns.",
    premium_content:
      "Saturn, your ruling planet, forms a supportive aspect with Venus, bringing stability to financial matters and relationships. This cosmic alignment rewards disciplined efforts and careful planning. Leadership opportunities arise that align with your long-term ambitions.",
  },
  aquarius: {
    sign: "aquarius",
    date: new Date().toISOString().split("T")[0],
    content:
      "Innovation and originality highlight your day, Aquarius. Your unique perspective generates solutions that others overlook. Humanitarian concerns motivate your actions, and connecting with like-minded groups amplifies your impact. Technological matters proceed smoothly under your guidance.",
    premium_content:
      "Uranus forms an energizing aspect with Mercury, sparking brilliant ideas and unexpected insights. This cosmic alignment supports technological innovation, scientific exploration, and progressive thinking. Your ability to envision the future is especially enhanced.",
  },
  pisces: {
    sign: "pisces",
    date: new Date().toISOString().split("T")[0],
    content:
      "Intuition and compassion guide your day, Pisces. Creative inspiration flows freely, especially in artistic or musical pursuits. Spiritual practices bring inner peace and clarity. Your empathetic nature helps others feel understood and supported through their challenges.",
    premium_content:
      "Neptune, your ruling planet, forms a harmonious aspect with the Moon, deepening your intuitive abilities and emotional sensitivity. This cosmic blessing enhances creative visualization, spiritual connection, and artistic expression. Dream work and meditation are especially powerful.",
  },
};

// Mock data for compatibility readings
const mockCompatibility = {
  aries: {
    taurus: {
      content:
        "Aries and Taurus create a dynamic of fire meeting earth. While Aries brings excitement and initiative, Taurus offers stability and practicality. This combination can be challenging but rewarding when both signs appreciate their differences. Aries can learn patience from Taurus, while Taurus benefits from Aries' spontaneity and courage.",
    },
    gemini: {
      content:
        "Aries and Gemini form an energetic and stimulating partnership. Both signs value independence and bring enthusiasm to the relationship. Aries appreciates Gemini's wit and intellectual approach, while Gemini admires Aries' confidence and directness. Together they create an exciting, fast-paced dynamic with plenty of activity and conversation.",
    },
    // Add other signs as needed
  },
  taurus: {
    aries: {
      content:
        "Taurus and Aries blend earth and fire energies. Taurus brings patience and reliability, while Aries contributes enthusiasm and initiative. This combination works when Taurus appreciates Aries' excitement and Aries respects Taurus' need for security. Together they can balance action with thoughtfulness.",
    },
    gemini: {
      content:
        "Taurus and Gemini combine earth and air elements, creating an interesting contrast. Taurus offers stability and sensuality, while Gemini brings intellectual stimulation and variety. This relationship thrives when Taurus helps ground Gemini's scattered energy, and Gemini introduces new ideas to Taurus' routine.",
    },
    // Add other signs as needed
  },
  // Add other signs as needed
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  console.log(`API Request to: ${endpoint}`);

  // Check if this is a horoscope request
  if (endpoint.startsWith("/api/horoscopes/")) {
    const sign = endpoint.split("/").pop()?.toLowerCase();
    console.log(`Horoscope requested for sign: ${sign}`);

    if (sign && mockHoroscopes[sign as keyof typeof mockHoroscopes]) {
      console.log(`Using mock data for ${sign} horoscope`);
      return mockHoroscopes[sign as keyof typeof mockHoroscopes];
    }
  }

  // Check if this is a compatibility request
  if (endpoint.startsWith("/api/compatibility/")) {
    const parts = endpoint.split("/");
    const sign1 = parts[parts.length - 2]?.toLowerCase();
    const sign2 = parts[parts.length - 1]?.toLowerCase();
    console.log(`Compatibility requested for: ${sign1} and ${sign2}`);

    if (
      sign1 &&
      sign2 &&
      mockCompatibility[sign1 as keyof typeof mockCompatibility] &&
      mockCompatibility[sign1 as keyof typeof mockCompatibility][sign2 as any]
    ) {
      console.log(`Using mock data for ${sign1}/${sign2} compatibility`);
      return mockCompatibility[sign1 as keyof typeof mockCompatibility][
        sign2 as any
      ];
    }

    // Fallback compatibility data
    return {
      content: `The cosmic energies between ${sign1} and ${sign2} create an interesting dynamic. While each sign brings unique strengths to the relationship, understanding and compromise are key to harmonizing your different approaches to life. Focus on communication and appreciating your complementary qualities.`,
    };
  }

  // Try the actual API request
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`${response.status}: ${JSON.stringify(error)}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed: ${error}`);

    // For any other endpoint, throw the error
    throw error;
  }
};
