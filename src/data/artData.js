import { resolveAssetUrl } from '@/lib/utils';

export const DEFAULT_STUDIO_INFO = {
  name: "Withinart",
  tagline: "Handcrafted Luxury Oil Paintings & Bespoke Islamic Fine Art",
  city: "Faisalabad, Pakistan",
  address: "Studio #4, Art District, D-Ground, Peoples Colony, Faisalabad",
  phone: "+92 300 7654321",
  whatsapp: "923007654321",
  email: "msaadzia44@gmail.com",
  announcement: "🎨 100% Original Hand-Painted Masterpieces • Stretched on Seasoned Sheesham Wood • Shipped in Signature Jute Packaging Across Pakistan & Worldwide",
};

export const DEFAULT_STORY_STEPS = [
  {
    id: "step-1",
    stepNumber: "01",
    label: "Studio & Origins",
    title: "Faisalabad Studio & Heritage",
    subtitle: "Proudly Based in Faisalabad — Our Studio & Art Atelier",
    description:
      "We are proud artisans from Faisalabad with our flagship atelier located in D-Ground. We craft and showcase 100% original handmade paintings, where every canvas is meticulously painted by our resident master artists.",
    woodName: "Artisan Heritage Canvas",
    image: resolveAssetUrl("/images/faisalabad_art_studio.jpg"),
    badge: "Origin Studio",
    link: "https://maps.google.com/?q=Faisalabad+Pakistan"
  },
  {
    id: "step-2",
    stepNumber: "02",
    label: "Solid Wood Craft",
    title: "Seasoned Solid Sheesham & Pine Wood",
    subtitle: "Wood Selection: Seasoned Sheesham & Kiln-Dried Pine Stretcher Bars",
    description:
      "A painting's foundation begins with solid timber. Our stretcher frames are handcrafted by Faisalabad's master carpenters using genuine seasoned Sheesham (rosewood) and kiln-dried Pine, ensuring your artwork remains perfectly flat and warp-free for decades on your wall.",
    woodName: "Seasoned Shisham (Rosewood) & Chinar Pine",
    image: resolveAssetUrl("/images/wood_frame_craft.jpg"),
    badge: "Solid Hardwood",
    link: "#wood-craft"
  },
  {
    id: "step-3",
    stepNumber: "03",
    label: "Handmade Brushwork",
    title: "Hand-Stretched Canvas, Master Brushwork & Impasto Knife Craft",
    subtitle: "Master Artisan Oil Layers & 24K Gold Leaf Inlay",
    description:
      "Over our robust seasoned wood frames, pure linen canvas is stretched and layered with natural bristle brushes and sculptured palette knives. Each piece features rich 3D impasto textures, pure pigments, and exquisite 24K gold foil detailing.",
    woodName: "Palette Knife & Natural Sable Brush Strokes",
    image: resolveAssetUrl("/images/brush_painting_action.jpg"),
    badge: "100% Hand-Painted",
    link: "#brushwork"
  },
  {
    id: "step-4",
    stepNumber: "04",
    label: "Jute Packaging",
    title: "Eco-Friendly Signature Jute Burlap Packaging",
    subtitle: "Shipped in Traditional Eco-Friendly Jute Fabric",
    description:
      "Rather than using plastic and synthetic wraps, we wrap every artwork in premium eco-friendly jute burlap fabric, accented with a traditional red wax seal, wooden corner guards, and an official Certificate of Authenticity.",
    woodName: "Organic Jute Burlap with Wax Seal & Corner Guards",
    image: resolveAssetUrl("/images/jute_packaging_craft.jpg"),
    badge: "Eco Jute Wrap",
    link: "#jute-pack"
  }
];

export const DEFAULT_PAINTINGS = [
  {
    id: "wood-slice-1",
    title: "Madina Munawwarah Roza-e-Rasool",
    category: "Islamic Art",
    medium: "Impasto Oil on Natural Bark Wood Slice",
    dimensions: "5 x 5 inches",
    woodFrame: "Solid Tree Bark Wood Slice with Clear Acrylic Display Stand & Hanging Jute Rope",
    pricePKR: 2500,
    priceUSD: 9,
    badge: "Popular",
    wallImage: resolveAssetUrl("/images/madina_wall.jpg"),
    closeupImage: resolveAssetUrl("/images/madina.png"),
    description:
      "Hand-painted sacred portrait of the Green Dome (Roza-e-Rasool ﷺ) and minaret of Masjid an-Nabawi under glowing moonlight on genuine rustic tree wood slice. Includes transparent display stand and hanging jute cord.",
    inStock: true,
    featured: true
  },
  {
    id: "wood-slice-2",
    title: "The Holy Kaaba (Sacred Journey)",
    category: "Sufi & Spiritual",
    medium: "Textured Oil on Natural Bark Wood Slice",
    dimensions: "5 x 5 inches",
    woodFrame: "Solid Tree Bark Wood Slice with Clear Acrylic Display Stand & Hanging Jute Rope",
    pricePKR: 2500,
    priceUSD: 9,
    badge: "Best Seller",
    wallImage: resolveAssetUrl("/images/hope_wall.jpg"),
    closeupImage: resolveAssetUrl("/images/hope.png"),
    description:
      "An emotional sacred journey artwork depicting a devotee beholding the Holy Kaaba in Makkah. Hand-painted in rich impasto oil paint on a seasoned natural wood slice.",
    inStock: true,
    featured: true
  },
  {
    id: "wood-slice-3",
    title: "Hamara Ghar Moonlit Cottage",
    category: "Custom Keepsakes",
    medium: "Original Oil & Calligraphy on Solid Bark Wood Slice",
    dimensions: "5 x 5 inches",
    woodFrame: "Solid Tree Bark Wood Slice with Clear Acrylic Display Stand & Hanging Jute Rope",
    pricePKR: 2500,
    priceUSD: 9,
    badge: "Customizable",
    wallImage: resolveAssetUrl("/images/hamara_ghr_wall.jpg"),
    closeupImage: resolveAssetUrl("/images/hamara_ghr.png"),
    description:
      "Enchanting night cottage under starry skies with glowing warm windows and personalized family nameplate 'پیارا گھر'. Can be customized with your family name or special date.",
    inStock: true,
    featured: true
  },
  {
    id: "wood-slice-4",
    title: "Autumn Glow Vintage Street Lamp",
    category: "Landscape & Nature",
    medium: "Vibrant Impasto Oil on Natural Wood Slice",
    dimensions: "5 x 5 inches",
    woodFrame: "Solid Tree Bark Wood Slice with Clear Acrylic Display Stand & Hanging Jute Rope",
    pricePKR: 2500,
    priceUSD: 9,
    badge: "New Arrival",
    wallImage: resolveAssetUrl("/images/autumn_lamp_wall.jpg"),
    closeupImage: resolveAssetUrl("/images/autumn_lamp.png"),
    description:
      "Warm glowing vintage wrought iron street lantern against rustic brickwork surrounded by fiery amber autumn foliage. Thick knife textured oil painting on a round natural wood slice.",
    inStock: true,
    featured: true
  },
  {
    id: "wood-slice-5",
    title: "Personalized Wedding Ceremony Keepsake",
    category: "Custom Keepsakes",
    medium: "Hand-Lettered Fine Art on Natural Wood Slice",
    dimensions: "5 x 5 inches",
    woodFrame: "Solid Tree Bark Wood Slice with Clear Acrylic Display Stand & Hanging Jute Rope",
    pricePKR: 2500,
    priceUSD: 9,
    badge: "Personalized",
    wallImage: resolveAssetUrl("/images/wedding_wall.png"),
    closeupImage: resolveAssetUrl("/images/wedding.png"),
    description:
      "A timeless personalized wedding announcement and anniversary keepsake painted on genuine tree wood slice. Custom names and dates hand-lettered with botanical leaf wreath.",
    inStock: true,
    featured: true
  }
];

export const DEFAULT_REVIEW_CARDS = [
  {
    title: "Dr. Tariq Jamil",
    city: "DHA Phase 6, Lahore",
    rating: 5,
    artPurchased: "Madina Munawwarah Roza-e-Rasool",
    description:
      "“The wood slice painting of Madina Munawwarah is sheer perfection on our console. When you view it up close, the impasto oil texture and natural tree bark edge look incredible. The jute packaging was such an authentic touch!”",
    className: "bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/30 text-white",
    skeleton: null,
    config: { y: -20, x: 0, rotate: -10, zIndex: 2 }
  },
  {
    title: "Ayesha Bilgrami",
    city: "Clifton, Karachi",
    rating: 5,
    artPurchased: "The Holy Kaaba (Sacred Journey)",
    description:
      "“Faisalabad artisans have truly outdone themselves! The solid natural wood slice with its rustic bark and clear display stand looks divine in our prayer room. The spiritual depth brings peace to our home.”",
    className: "bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 border border-blue-500/30 text-white",
    skeleton: null,
    config: { y: 20, x: 180, rotate: 6, zIndex: 3 }
  },
  {
    title: "Hamza Farooq",
    city: "F-7/2, Islamabad",
    rating: 5,
    artPurchased: "Hamara Ghar Moonlit Cottage",
    description:
      "“Ordered two personalized wood slice pieces with our family name inscribed in Urdu Nastaliq. The palette knife impasto texture on the cottage roof and glowing windows is breathtaking!”",
    className: "bg-gradient-to-br from-emerald-700 via-teal-900 to-slate-900 border border-emerald-500/30 text-white",
    skeleton: null,
    config: { y: -10, x: -160, rotate: -4, zIndex: 1 }
  },
  {
    title: "Malik Shahbaz",
    city: "Kohinoor City, Faisalabad",
    rating: 5,
    artPurchased: "Autumn Glow Vintage Street Lamp",
    description:
      "“Being from Faisalabad myself, I was so proud to see such exquisite handmade wood slice art coming from our home city. Visited their atelier in D-Ground and saw the impasto painting craft live!”",
    className: "bg-gradient-to-br from-rose-700 via-purple-900 to-slate-900 border border-rose-500/30 text-white",
    skeleton: null,
    config: { y: 30, x: 80, rotate: 3, zIndex: 4 }
  },
  {
    title: "Zainab Al-Maktoum",
    city: "Downtown Dubai, UAE",
    rating: 5,
    artPurchased: "Personalized Wedding Keepsake",
    description:
      "“Delivered via DHL all the way from Faisalabad to Dubai in impeccable condition. The eco-friendly jute wrap and solid tree bark slice preserved the delicate oil layers completely intact. Truly museum grade!”",
    className: "bg-gradient-to-br from-amber-700 via-orange-950 to-slate-900 border border-amber-500/30 text-white",
    skeleton: null,
    config: { y: -30, x: -60, rotate: -8, zIndex: 2 }
  }
];
