import type { Product } from '@/types/product'

export const productsSeed: Product[] = [
  {
    id: 'oak-standing-desk',
    name: 'Minimalist Oak Standing Desk',
    price: 849,
    category: 'Furniture',
    rating: 4.9,
    reviewsCount: 124,
    description: 'A solid oak wood standing desk with a dual-motor electrical height-adjustment system. Built with premium materials to provide maximum stability and clean aesthetic workspace integration.',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600&auto=format&fit=crop',
    features: [
      'Solid European Oak tabletop (2.5cm thickness)',
      'Dual-motor silent height adjustment (38mm/s)',
      'Anti-collision safety sensors',
      '4 programmable height presets with memory',
      'Under-desk cable management tray included'
    ],
    specs: {
      'Tabletop Size': '140cm x 70cm',
      'Height Range': '62cm - 128cm',
      'Weight Capacity': '125kg',
      'Frame Material': 'Heavy-duty steel',
      'Warranty': '5 Years'
    }
  },
  {
    id: 'aura-ergo-chair',
    name: 'Aura Ergo Chair',
    price: 649,
    category: 'Seating',
    rating: 4.8,
    reviewsCount: 86,
    description: 'Highly adjustable ergonomic office chair featuring dynamic lumbar support, breathable weave mesh, and responsive tilt functionality to maximize support during long working hours.',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop',
    features: [
      'Self-adjusting dynamic lumbar support',
      'Fully breathable premium woven mesh backrest',
      '4D multi-directional armrests',
      'Synchronous tilt lock (up to 135 degrees)',
      'High-durability aluminum wheelbase'
    ],
    specs: {
      'Seat Height': '45cm - 55cm',
      'Recline Range': '90° - 135°',
      'Weight Limit': '136kg',
      'Casters': '60mm PU-coated quiet rollers',
      'Warranty': '3 Years'
    }
  },
  {
    id: 'beam-desk-light',
    name: 'Beam OLED Desk Light',
    price: 199,
    category: 'Lighting',
    rating: 4.7,
    reviewsCount: 54,
    description: 'A smart OLED desk lamp featuring dimmable natural spectrum lighting, adjustable arm nodes, and a sleek brushed metal frame with integrated wireless charger.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
    features: [
      'Natural daylight spectrum (95+ CRI) to reduce eye strain',
      'Integrated 15W Qi wireless charging pad in base',
      'Rotatable multi-axis swing arm',
      'Touch slider for color temperature and brightness control',
      'Ambient light sensors for auto-brightness adjustment'
    ],
    specs: {
      'Brightness': 'Up to 900 Lumens',
      'Color Temp': '2700K - 6500K (Warm to Cool)',
      'Power Consumption': '12W',
      'Base Diameter': '16cm',
      'Material': 'Anodized aluminum & brass'
    }
  },
  {
    id: 'linear-keyboard',
    name: 'Minimalist Linear Mechanical Keyboard',
    price: 229,
    category: 'Gadgets',
    rating: 4.9,
    reviewsCount: 92,
    description: 'A high-end 75% mechanical keyboard with hot-swappable linear switches, double-shot PBT keycaps, and a heavy solid-aluminum casing.',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop',
    features: [
      'Hot-swappable PCB supporting 3-pin & 5-pin switches',
      'Factory-lubed silent linear switches for smooth typing',
      'CNC-milled solid aluminum housing',
      'Gasket-mounted structure for satisfying sound',
      'USB-C wired and Bluetooth 5.1 wireless connectivity'
    ],
    specs: {
      'Form Factor': '75% layout (82 keys)',
      'Switch Type': 'Silent Linear (45g actuation)',
      'Battery Life': 'Up to 200 hours (RGB off)',
      'Keycaps': 'Double-shot PBT Cherry profile',
      'Weight': '1.45kg'
    }
  },
  {
    id: 'merino-desk-pad',
    name: 'Premium Merino Wool Desk Pad',
    price: 79,
    category: 'Gadgets',
    rating: 4.8,
    reviewsCount: 201,
    description: 'A luxurious desk mat crafted from 100% genuine merino wool felt. Provides a soft, warm layer of comfort for your hands while protecting your desktop.',
    image: 'https://images.unsplash.com/photo-1632292224971-0d45778b3002?q=80&w=600&auto=format&fit=crop',
    features: [
      '100% natural Merino wool felt',
      'Non-slip natural cork backing layer',
      'Naturally water-resistant and anti-static',
      'Soft cushioning for wrists and keyboards',
      'Sourced and handcrafted sustainably'
    ],
    specs: {
      'Dimensions': '90cm x 30cm',
      'Thickness': '4mm',
      'Color': 'Warm Anthracite Gray',
      'Material': 'Merino wool & natural cork'
    }
  },
  {
    id: 'glow-light-bar',
    name: 'Glow Monitor Light Bar',
    price: 129,
    category: 'Lighting',
    rating: 4.7,
    reviewsCount: 78,
    description: 'An asymmetrical screen bar light that clamps onto the top of your monitor. Lights up the desk space without reflecting glare on the screen.',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop',
    features: [
      'Asymmetrical optical design eliminates screen glare',
      'Auto-dimming feature adjusts with room brightness',
      'Space-saving clamp mounts to flat or curved monitors',
      'Wireless dial controller for desk placement control',
      'USB-powered (5V / 1A)'
    ],
    specs: {
      'Light Source': 'Dual-color LED (cool/warm)',
      'Fit range': '0.5cm - 5cm screen thickness',
      'Lux Level': '1000 Lux in center',
      'Color Temp': '2700K - 6500K',
      'Cable Length': '1.5m USB-C'
    }
  }
]
