// Server-side source of truth. Prices and specs are approximate list figures for this demo project.
const colors = [{ n: "Signal", h: "#ff5d6c" }, { n: "Lagoon", h: "#3ddc97" }, { n: "Amber", h: "#f5a524" }, { n: "Cobalt", h: "#7aa2ff" }, { n: "Ivory", h: "#e9edf7" }];
const gen = {
  Electric: ["Instant torque", "Over-the-air updates", "Regenerative braking"],
  Petrol: ["Turbocharged engine", "Adaptive cruise control", "Wireless smartphone mirroring"],
  Diesel: ["High-torque diesel engine", "Long touring range", "Driver assist suite"],
  Hybrid: ["Self-charging hybrid system", "Low running cost", "Adaptive cruise control"]
};
// brand, model, body, fuel, price USD, range km, hp, 0-100 s, seats, signature feature
const rows = [
  ["Toyota", "Camry", "Sedan", "Hybrid", 28500, 900, 225, 7.2, 5, "Class-leading fuel economy"],
  ["Toyota", "Fortuner", "SUV", "Diesel", 43000, 800, 201, 10.5, 7, "Rugged 4x4 ladder frame"],
  ["Toyota", "GR Supra", "Sports", "Petrol", 58000, 550, 382, 4.1, 2, "Turbo inline-six"],
  ["Honda", "Civic", "Sedan", "Petrol", 25000, 700, 158, 8.2, 5, "Sharp handling and light steering"],
  ["Honda", "CR-V", "SUV", "Hybrid", 34000, 850, 204, 7.6, 5, "Spacious family cabin"],
  ["Hyundai", "Ioniq 5", "SUV", "Electric", 42000, 480, 320, 5.1, 5, "800V ultra-fast charging"],
  ["Hyundai", "Creta", "SUV", "Petrol", 20000, 650, 158, 9.5, 5, "Panoramic sunroof"],
  ["Tata", "Nexon EV", "SUV", "Electric", 17000, 400, 143, 8.9, 5, "Best-value electric SUV"],
  ["Mahindra", "XUV700", "SUV", "Diesel", 24000, 750, 182, 9.5, 7, "Twin-screen digital cockpit"],
  ["Maruti Suzuki", "Swift", "Hatchback", "Petrol", 9000, 800, 82, 12, 5, "Lightweight and easy to park"],
  ["Volkswagen", "Golf GTI", "Hatchback", "Petrol", 34000, 600, 241, 5.9, 5, "The original hot hatch"],
  ["Ford", "Mustang GT", "Sports", "Petrol", 43000, 480, 480, 4.3, 4, "5.0L V8 soundtrack"],
  ["Ford", "F-150", "Truck", "Petrol", 39000, 750, 400, 6, 5, "Tow rating up to 5,000 kg"],
  ["Tesla", "Model 3", "Sedan", "Electric", 40000, 580, 283, 6.1, 5, "Autopilot ready"],
  ["Tesla", "Model Y", "SUV", "Electric", 44000, 530, 299, 6.6, 5, "Huge cargo space"],
  ["Tesla", "Model S Plaid", "Sedan", "Electric", 90000, 600, 1020, 2.1, 5, "Tri-motor hypercar acceleration"],
  ["BMW", "3 Series", "Sedan", "Petrol", 47000, 750, 255, 5.6, 5, "Benchmark driving dynamics"],
  ["BMW", "X5", "SUV", "Petrol", 65000, 750, 375, 5.3, 5, "Curved display cockpit"],
  ["BMW", "M4", "Sports", "Petrol", 80000, 600, 473, 3.9, 4, "Track-tuned chassis"],
  ["Mercedes-Benz", "C-Class", "Sedan", "Petrol", 47000, 700, 255, 6, 5, "MBUX infotainment"],
  ["Mercedes-Benz", "G-Class", "SUV", "Petrol", 145000, 600, 416, 5.6, 5, "Iconic off-road legend"],
  ["Mercedes-Benz", "EQS", "Sedan", "Electric", 105000, 700, 516, 4.3, 5, "Full-width Hyperscreen"],
  ["Audi", "A4", "Sedan", "Petrol", 45000, 750, 261, 5.4, 5, "Quattro all-wheel drive"],
  ["Audi", "Q7", "SUV", "Petrol", 60000, 700, 335, 5.6, 7, "Seven-seat luxury"],
  ["Audi", "RS e-tron GT", "Sports", "Electric", 145000, 490, 637, 3.3, 4, "Electric grand tourer"],
  ["Porsche", "911 Carrera", "Sports", "Petrol", 120000, 550, 379, 4.2, 4, "Rear-engine icon"],
  ["Porsche", "Taycan", "Sedan", "Electric", 100000, 500, 402, 5.1, 4, "Sports car feel, electric"],
  ["Land Rover", "Defender 110", "SUV", "Petrol", 62000, 650, 296, 7.1, 7, "Go-anywhere capability"],
  ["Lamborghini", "Urus", "SUV", "Petrol", 230000, 600, 657, 3.6, 5, "Super SUV with a twin-turbo V8"],
  ["Ferrari", "Roma", "Sports", "Petrol", 245000, 500, 612, 3.4, 4, "Everyday Ferrari V8"]
];
module.exports = rows.map(([brand, m, body, fuel, price, rangeKm, hp, accel, seats, sig]) => ({
  id: (brand + " " + m).toLowerCase().replace(/[^a-z0-9]+/g, "-"), name: brand + " " + m, brand, body, type: body, fuel,
  price, rangeKm, hp, accel, seats, colors, features: [sig, ...gen[fuel]]
}));
