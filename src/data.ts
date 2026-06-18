export interface Professional {
  id: number;
  name: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
  image: string;
  verified: boolean;
  featured?: boolean;
  yearsOfExperience: number;
}

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  type: 'Buy' | 'Rent' | 'Shortlet';
  propertyType: string;
  image: string;
  verified: boolean;
  coordinates: { x: number; y: number };
  landSize: string;
  listedDate: string;
  agent?: {
    name: string;
    avatar: string;
    agency?: string;
    listings?: number;
  };
  description?: string;
  amenities?: string[];
  features?: string[];
  gallery?: string[];
  mortgageEstimate?: string;
  titleType?: string;
  rentBreakdown?: {
    rent: string;
    serviceCharge: string;
    agencyFee: string;
    legalFee: string;
    cautionFee: string;
  };
  houseRules?: string[];
}

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: "Barr. Tunde Oladipo",
    category: "Lawyers",
    title: "Real Estate Attorney",
    rating: 4.9,
    reviews: 128,
    location: "Ikoyi, Lagos",
    services: ["Property law", "Contract review", "Title verification"],
    image: "https://images.unsplash.com/photo-1652702954883-622efc786f70?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    featured: true,
    yearsOfExperience: 12
  },
  {
    id: 2,
    name: "Engr. Chidi Okafor",
    category: "Surveyors",
    title: "Registered Land Surveyor",
    rating: 4.7,
    reviews: 85,
    location: "Lekki, Lagos",
    services: ["Land surveying", "Topographic mapping", "Boundary marking"],
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    featured: false,
    yearsOfExperience: 8
  },
  {
    id: 3,
    name: "Sandra Edet",
    category: "Interior Designers",
    title: "Creative Director, Luxe Interiors",
    rating: 4.8,
    reviews: 210,
    location: "Maitama, Abuja",
    services: ["Space planning", "Luxury furnishing", "Renovation management"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    featured: true,
    yearsOfExperience: 10
  },
  {
    id: 4,
    name: "SwiftMovers Nigeria",
    category: "Movers",
    title: "Professional Relocation Experts",
    rating: 4.6,
    reviews: 342,
    location: "Gbagada, Lagos",
    services: ["Household moving", "Office relocation", "Packing & crating"],
    image: "https://images.unsplash.com/photo-1666558889375-798fa96b559a?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    featured: false,
    yearsOfExperience: 5
  },
  {
    id: 5,
    name: "Architect Funmi Adeyemi",
    category: "Interior Designers",
    title: "Principal Architect",
    rating: 4.9,
    reviews: 156,
    location: "Victoria Island, Lagos",
    services: ["Architectural design", "Project supervision", "Interior design"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    featured: true,
    yearsOfExperience: 15
  },
  {
    id: 6,
    name: "SafeGuard Inspections",
    category: "Property Inspectors",
    title: "Certified Home Inspectors",
    rating: 4.5,
    reviews: 98,
    location: "Surulere, Lagos",
    services: ["Structural audit", "Electrical inspection", "Moisture testing"],
    image: "https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    featured: false,
    yearsOfExperience: 7
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Luxury 4-Bedroom Detached Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦180,000,000",
    bedrooms: 4,
    bathrooms: 4,
    type: "Buy",
    propertyType: "Duplex",
    image: "https://images.unsplash.com/photo-1643297551340-19d8ad4f20ad?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    coordinates: { x: 30, y: 40 },
    landSize: "450 sqm",
    listedDate: "2 days ago",
    agent: { name: "Adeola M.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150", agency: "Houzii Premier", listings: 25 },
    description: "This contemporary masterpiece in Lekki Phase 1 offers unparalleled luxury. Featuring smart home integration, a private swimming pool, and an elevator, it's designed for the discerning homeowner. The expansive master suite includes a walk-in closet and a private balcony with city views.",
    amenities: ["Swimming Pool", "24hr Electricity", "Smart Home", "Elevator", "Gated Estate", "Security"],
    features: ["4 Bedrooms", "4 Bathrooms", "450 sqm", "Fully Detached"],
    gallery: [
      "https://images.unsplash.com/photo-1643297551340-19d8ad4f20ad?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1080"
    ],
    mortgageEstimate: "₦1,200,000 / month",
    titleType: "C of O"
  },
  {
    id: 4,
    title: "Contemporary 5-Bedroom Mansion",
    location: "Banana Island, Lagos",
    price: "₦850,000,000",
    bedrooms: 5,
    bathrooms: 6,
    type: "Buy",
    propertyType: "Mansion",
    image: "https://images.unsplash.com/photo-1703967620345-a9d07d7dabd2?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    coordinates: { x: 65, y: 45 },
    landSize: "800 sqm",
    listedDate: "5 days ago",
    agent: { name: "Chinedu O.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150", agency: "Banana Island Estates", listings: 12 },
    description: "Experience absolute exclusivity in this Banana Island mansion. Situated on the waterfront, this property offers panoramic ocean views, a private jetty, and sprawling lush gardens. Every corner reflects opulence and architectural brilliance.",
    amenities: ["Waterfront View", "Private Jetty", "Infinity Pool", "Garden", "Gated Estate", "Security"],
    gallery: [
      "https://images.unsplash.com/photo-1703967620345-a9d07d7dabd2?auto=format&fit=crop&q=80&w=1080",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1080"
    ],
    titleType: "Governor's Consent"
  },
  {
    id: 5,
    title: "Modern 4-Bedroom Semi-Detached",
    location: "G.R.A Phase 2, Port Harcourt",
    price: "₦120,000,000",
    bedrooms: 4,
    bathrooms: 5,
    type: "Buy",
    propertyType: "Semi-Detached",
    image: "https://images.unsplash.com/photo-1643297550841-1386b3a10612?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    coordinates: { x: 40, y: 70 },
    landSize: "350 sqm",
    listedDate: "1 week ago",
    agent: { name: "Sarah K.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150", agency: "PH Prime Properties", listings: 18 },
    description: "Located in the serene G.R.A Phase 2, this semi-detached home is perfect for a growing family. It features spacious rooms, a modern kitchen, and a well-landscaped backyard.",
    amenities: ["24hr Power", "Quiet Neighborhood", "Security", "Fenced Yard"],
    titleType: "C of O"
  },
  {
    id: 6,
    title: "Exquisite 6-Bedroom Smart Villa",
    location: "Maitama, Abuja",
    price: "₦950,000,000",
    bedrooms: 6,
    bathrooms: 7,
    type: "Buy",
    propertyType: "Villa",
    image: "https://images.unsplash.com/photo-1734184451176-d3ca5bb6b64a?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    coordinates: { x: 55, y: 25 },
    landSize: "1200 sqm",
    listedDate: "Just listed",
    agent: { name: "Ibrahim S.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150", agency: "Abuja Luxury Realty", listings: 8 },
    description: "A state-of-the-art smart villa in the heart of Maitama. This villa redefines modern living with voice-controlled systems, a cinema room, and a gym.",
    amenities: ["Smart Home", "Cinema", "Gym", "Security", "Backup Power"],
    titleType: "C of O"
  },
  {
    id: 2,
    title: "Modern 2-Bedroom Serviced Apartment",
    location: "Victoria Island, Lagos",
    price: "₦8,000,000 / yr",
    bedrooms: 2,
    bathrooms: 3,
    type: "Rent",
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1585011191285-8b443579631c?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    coordinates: { x: 45, y: 55 },
    landSize: "120 sqm",
    listedDate: "3 days ago",
    agent: { name: "Joy A.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150", agency: "Lagos Lifestyle Rentals", listings: 34 },
    description: "Ideal for professionals, this serviced apartment in Victoria Island offers convenience and style. Fully furnished with high-end appliances and access to a shared gym and pool.",
    amenities: ["Gym", "Pool", "24hr Power", "Concierge"],
    rentBreakdown: {
      rent: "₦8,000,000",
      serviceCharge: "₦1,500,000",
      agencyFee: "₦800,000",
      legalFee: "₦800,000",
      cautionFee: "₦500,000"
    }
  },
  {
    id: 15,
    title: "Luxury 3-Bedroom Penthouse",
    location: "Ikoyi, Lagos",
    price: "₦25,000,000 / yr",
    bedrooms: 3,
    bathrooms: 4,
    type: "Rent",
    propertyType: "Penthouse",
    image: "https://images.unsplash.com/photo-1640475168764-b0a8860c0fcf?auto=format&fit=crop&q=80&w=1080",
    verified: true,
    coordinates: { x: 50, y: 50 },
    landSize: "300 sqm",
    listedDate: "1 week ago",
    agent: { name: "Chinedu O.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150", agency: "Ikoyi Prime Properties", listings: 12 },
    description: "Stunning penthouse in Ikoyi with breathtaking views of the Lagos lagoon. Features high ceilings, floor-to-ceiling windows, and a private wraparound terrace.",
    amenities: ["Lagoon View", "Private Terrace", "24hr Power", "Pool", "Gym"],
    rentBreakdown: {
      rent: "₦25,000,000",
      serviceCharge: "₦3,000,000",
      agencyFee: "₦2,500,000",
      legalFee: "₦2,500,000",
      cautionFee: "₦1,000,000"
    }
  },
  {
    id: 3,
    title: "Premium Shortlet with Ocean View",
    location: "Ikoyi, Lagos",
    price: "₦150,000 / night",
    bedrooms: 3,
    bathrooms: 3,
    type: "Shortlet",
    propertyType: "Shortlet",
    image: "https://images.unsplash.com/photo-1642703168632-5a711d91b043?auto=format&fit=crop&q=80&w=1080",
    verified: false,
    coordinates: { x: 60, y: 35 },
    landSize: "250 sqm",
    listedDate: "Available Now",
    agent: { name: "Adeola M.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150", agency: "Houzii Stays", listings: 45 },
    description: "Your home away from home. This premium shortlet offers comfort and luxury with a stunning ocean view. Perfect for vacations or business trips.",
    amenities: ["Ocean View", "Fast WiFi", "Smart TV", "Chef Available", "Housekeeping"],
    houseRules: ["No parties", "No smoking", "No pets", "Check-in: 2 PM", "Check-out: 12 PM"]
  }
];
