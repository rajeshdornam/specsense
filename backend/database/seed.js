const fs = require('fs');
const path = require('path');
const db = require('./db');

async function seed() {
  console.log('--- Initializing SpecSense Database with Demo Scenario ---');
  
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  await db.init();

  // Drop and recreate tables to guarantee clean primary keys starting at 1
  console.log('Resetting schema for clean IDs...');
  await db.exec(`
    DROP TABLE IF EXISTS price_alerts;
    DROP TABLE IF EXISTS price_history;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS retailers;
    DROP TABLE IF EXISTS sales_events;
  `);

  await db.exec(schemaSql);

  console.log('Inserting verified retailers...');
  const retailers = [
    { id: 1, name: 'Amazon', website: 'https://amazon.in', badge_color: '#EA580C' },
    { id: 2, name: 'Flipkart', website: 'https://flipkart.com', badge_color: '#1D4ED8' },
    { id: 3, name: 'Direct Brand Store', website: 'https://officialbrand.com', badge_color: '#059669' }
  ];

  for (const r of retailers) {
    await db.run('INSERT INTO retailers (id, name, website, badge_color) VALUES (?, ?, ?, ?)', [
      r.id, r.name, r.website, r.badge_color
    ]);
  }

  console.log('Inserting 16 electronics products with full technical specifications...');
  const products = [
    {
      name: 'Apple iPhone 15 (128GB)',
      brand: 'Apple',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      current_price: 66999,
      refurbished_price: 51999,
      rating: 4.7,
      processor: 'A16 Bionic (4nm Hexa-core, 5-core GPU)',
      ram: '6 GB LPDDR5',
      storage: '128 GB NVMe',
      display: '6.1-inch Super Retina XDR (2556 x 1179)',
      display_type: 'OLED with Dynamic Island (Peak 2000 nits)',
      refresh_rate: '60 Hz',
      battery: '3349 mAh Li-Ion (Up to 20 hrs video)',
      charging_speed: '20W Fast Charging (50% in 30 min), 15W MagSafe',
      camera: '48MP Main (f/1.6, Sensor-shift OIS) + 12MP Ultra-wide (f/2.4)',
      front_camera: '12MP TrueDepth (f/1.9, Autofocus)',
      operating_system: 'iOS 17 (Upgradable to iOS 18)',
      benchmark_score: 1420000,
      weight: '171 g (Aerospace-grade Aluminum)',
      connectivity: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C 2.0, NFC Apple Pay'
    },
    {
      name: 'Samsung Galaxy S23 5G (128GB)',
      brand: 'Samsung',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      current_price: 52999,
      refurbished_price: 39999,
      rating: 4.6,
      processor: 'Snapdragon 8 Gen 2 for Galaxy (4nm Octa-core, 3.36 GHz)',
      ram: '8 GB LPDDR5X',
      storage: '128 GB UFS 3.1',
      display: '6.1-inch Dynamic AMOLED 2X (2340 x 1080)',
      display_type: 'FHD+ HDR10+ (Peak 1750 nits, Gorilla Glass Victus 2)',
      refresh_rate: '120 Hz Adaptive (48-120Hz)',
      battery: '3900 mAh Li-Ion (Up to 22 hrs video)',
      charging_speed: '25W Super Fast Wired, 15W Fast Wireless, 4.5W Wireless PowerShare',
      camera: '50MP (f/1.8 OIS) + 10MP Telephoto (3x Optical, OIS) + 12MP Ultra-wide',
      front_camera: '12MP Dual Pixel AF (f/2.2)',
      operating_system: 'Android 14 (One UI 6.1 with Galaxy AI)',
      benchmark_score: 1490000,
      weight: '168 g (Armor Aluminum Frame, IP68)',
      connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C 3.2 Gen 1, NFC, DeX'
    },
    {
      name: 'Google Pixel 8 (128GB)',
      brand: 'Google',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
      current_price: 61999,
      refurbished_price: 46999,
      rating: 4.5,
      processor: 'Google Tensor G3 (4nm NPU-focused with Titan M2 security)',
      ram: '8 GB LPDDR5X',
      storage: '128 GB UFS 3.1',
      display: '6.2-inch Actua Display OLED (2400 x 1080)',
      display_type: 'FHD+ OLED (Peak 2000 nits, Gorilla Glass Victus)',
      refresh_rate: '120 Hz Smooth Display (60-120Hz)',
      battery: '4575 mAh Li-Ion (24+ hrs battery life)',
      charging_speed: '27W Fast Wired (50% in 30 min), 18W Fast Wireless Qi',
      camera: '50MP Octa-PD (f/1.68, OIS) + 12MP Ultra-wide with Macro Focus',
      front_camera: '10.5MP Dual PD (f/2.2, 95° Ultrawide)',
      operating_system: 'Stock Android 14 (7 Years Guaranteed OS & Security Updates)',
      benchmark_score: 1180000,
      weight: '187 g (Matte Aluminum, IP68 Water/Dust)',
      connectivity: '5G Sub-6, Wi-Fi 7, Bluetooth 5.3, USB-C 3.2, NFC Google Wallet'
    },
    {
      name: 'OnePlus 12 (256GB)',
      brand: 'OnePlus',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      current_price: 64999,
      refurbished_price: 49999,
      rating: 4.8,
      processor: 'Snapdragon 8 Gen 3 (4nm Octa-core, Adreno 750 GPU)',
      ram: '12 GB LPDDR5X (Up to 16GB Virtual)',
      storage: '256 GB UFS 4.0 High-Speed',
      display: '6.82-inch ProXDR 2K AMOLED (3168 x 1440)',
      display_type: 'QHD+ LTPO 4.0 (Industry-leading Peak 4500 nits, Dolby Vision)',
      refresh_rate: '120 Hz Adaptive Dynamic (1-120Hz)',
      battery: '5400 mAh Dual-cell Ultra-capacity',
      charging_speed: '100W SUPERVOOC (100% in 26 min), 50W AIRVOOC Wireless',
      camera: '50MP Sony LYT-808 (f/1.6 OIS) + 64MP 3x Periscope Telephoto + 48MP Ultra-wide (Hasselblad)',
      front_camera: '32MP Sony IMX615 (f/2.4)',
      operating_system: 'OxygenOS 14 (Android 14 with Trinity Engine)',
      benchmark_score: 2110000,
      weight: '220 g (Curved Glass & Aluminum, IP65 with Aqua Touch)',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2 Gen 1, IR Blaster, NFC'
    },
    {
      name: 'Apple MacBook Air M2 (8GB / 256GB)',
      brand: 'Apple',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
      current_price: 89990,
      refurbished_price: 69999,
      rating: 4.8,
      processor: 'Apple M2 (8-core CPU, 8-core GPU, 16-core Neural Engine)',
      ram: '8 GB Unified Memory (100GB/s bandwidth)',
      storage: '256 GB PCIe NVMe High-speed SSD',
      display: '13.6-inch Liquid Retina True Tone (2560 x 1664)',
      display_type: 'IPS LED-backlit (500 nits, Wide Color P3)',
      refresh_rate: '60 Hz',
      battery: '52.6 Wh Lithium-Polymer (Up to 18 hrs Apple TV playback)',
      charging_speed: '30W MagSafe 3 Fast Charging (Supports up to 67W USB-C)',
      camera: '1080p FaceTime HD camera with computational video',
      front_camera: 'N/A',
      operating_system: 'macOS Sonoma (Upgradable to macOS Sequoia)',
      benchmark_score: 1680000,
      weight: '1.24 kg (11.3mm Thin Fanless Unibody Aluminum)',
      connectivity: 'Wi-Fi 6 (802.11ax), Bluetooth 5.3, 2x Thunderbolt 4 / USB 4, MagSafe 3'
    },
    {
      name: 'Lenovo ThinkPad E14 Gen 5 (16GB / 512GB)',
      brand: 'Lenovo',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      current_price: 62490,
      refurbished_price: 44990,
      rating: 4.4,
      processor: 'Intel Core i5-1335U 13th Gen (10 cores: 2P + 8E, up to 4.6 GHz)',
      ram: '16 GB DDR4-3200 (Dual Channel, Upgradeable to 40GB)',
      storage: '512 GB M.2 2242 PCIe 4.0 NVMe SSD (Dual M.2 slots)',
      display: '14-inch WUXGA Anti-glare (1920 x 1200, 16:10 aspect)',
      display_type: 'IPS 300 nits (45% NTSC, TÜV Rheinland Low Blue Light)',
      refresh_rate: '60 Hz',
      battery: '57 Wh Li-Ion (Rapid Charge: 80% in 60 min)',
      charging_speed: '65W USB-C AC Adapter',
      camera: 'FHD 1080p with ThinkShutter Physical Privacy',
      front_camera: 'N/A',
      operating_system: 'Windows 11 Pro 64-bit',
      benchmark_score: 1140000,
      weight: '1.53 kg (Military Grade MIL-STD-810H Certified Aluminum)',
      connectivity: 'Wi-Fi 6, Bluetooth 5.1, Thunderbolt 4, HDMI 2.1, RJ45 Gigabit Ethernet'
    },
    {
      name: 'Dell XPS 13 Plus (16GB / 512GB)',
      brand: 'Dell',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
      current_price: 134990,
      refurbished_price: 99990,
      rating: 4.6,
      processor: 'Intel Core i7-1360P 13th Gen (12 cores: 4P + 8E, up to 5.0 GHz)',
      ram: '16 GB LPDDR5 6000MHz Dual Channel',
      storage: '512 GB PCIe 4.0 NVMe M.2 SSD',
      display: '13.4-inch InfinityEdge OLED Touch 3.5K (3456 x 2160)',
      display_type: 'OLED 3.5K (400 nits, 100% DCI-P3, DisplayHDR 500)',
      refresh_rate: '60 Hz',
      battery: '55 Wh ExpressCharge Capable (Up to 10 hrs)',
      charging_speed: '60W USB-C AC Adapter (80% in 1 hr)',
      camera: '720p HD RGB + IR Webcam with Windows Hello Facial Recognition',
      front_camera: 'N/A',
      operating_system: 'Windows 11 Home 64-bit',
      benchmark_score: 1820000,
      weight: '1.26 kg (CNC Machined Aluminum with Glass Palmrest)',
      connectivity: 'Wi-Fi 6E (Intel Killer AX211), Bluetooth 5.3, 2x Thunderbolt 4 Type-C'
    },
    {
      name: 'ASUS ROG Zephyrus G14 Gaming Laptop',
      brand: 'ASUS',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
      current_price: 149990,
      refurbished_price: 112990,
      rating: 4.7,
      processor: 'AMD Ryzen 9 8945HS (8-core/16-thread, AI NPU 39 TOPS)',
      ram: '16 GB LPDDR5X-6400MHz Dual Channel',
      storage: '1 TB PCIe 4.0 NVMe M.2 SSD',
      display: '14-inch ROG Nebula OLED 3K (2880 x 1800, 16:10)',
      display_type: 'OLED 0.2ms (G-Sync, 100% DCI-P3, VESA DisplayHDR True Black 500)',
      refresh_rate: '120 Hz Ultra-fast Response',
      battery: '73 Wh 4-cell Li-ion High Capacity',
      charging_speed: '100W Type-C Fast Charging / 180W Adapter',
      camera: '1080p FHD IR Camera with Windows Hello',
      front_camera: 'N/A',
      operating_system: 'Windows 11 Home 64-bit',
      benchmark_score: 2450000,
      weight: '1.50 kg (CNC Aluminum Chassis with Slash Lighting)',
      connectivity: 'Wi-Fi 6E, Bluetooth 5.3, USB4 Type-C, HDMI 2.1, MicroSD Card Reader'
    },
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      category: 'Headphones',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
      current_price: 26990,
      refurbished_price: 18990,
      rating: 4.8,
      processor: 'Dual Chip: Integrated Processor V1 + HD NC Processor QN1',
      ram: 'N/A (DSP Buffer Architecture)',
      storage: 'N/A (Companion App Preset Storage)',
      display: 'N/A (Capacitive Touch Gesture Controls on Earcups)',
      display_type: 'Capacitive Touch Surface with Wear Detection',
      refresh_rate: 'N/A',
      battery: '30 Hours with ANC On (40 Hours ANC Off)',
      charging_speed: 'USB-PD Fast Charge (3 min charge gives 3 hrs playback)',
      camera: '8 Microphones with Auto NC Optimizer & 4 Beamforming Voice Mics',
      front_camera: 'N/A',
      operating_system: 'Sony Headphones Connect App (iOS & Android)',
      benchmark_score: 950000,
      weight: '250 g (Ultra-comfortable Soft Fit Leatherette)',
      connectivity: 'Bluetooth 5.2, LDAC Hi-Res, Multipoint 2 Devices, 3.5mm Aux Cable'
    },
    {
      name: 'Bose QuietComfort 45 Headphones',
      brand: 'Bose',
      category: 'Headphones',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      current_price: 21999,
      refurbished_price: 15499,
      rating: 4.6,
      processor: 'Bose TriPort Acoustic Architecture & Volume-optimized Active EQ',
      ram: 'N/A',
      storage: 'N/A',
      display: 'N/A (Tactile Physical Button Array)',
      display_type: 'Physical Multi-function Buttons',
      refresh_rate: 'N/A',
      battery: '24 Hours Playtime per charge with ANC',
      charging_speed: 'USB-C Fast Charging (15 min charge gives 2.5 hrs)',
      camera: '6 Microphones with Noise Rejecting Algorithm for Voice',
      front_camera: 'N/A',
      operating_system: 'Bose Music App Companion (iOS & Android)',
      benchmark_score: 890000,
      weight: '240 g (Cast-metal Hinges & Synthetic Protein Leather)',
      connectivity: 'Bluetooth 5.1, AAC/SBC, 3.5mm to 2.5mm Audio Cable, Multipoint'
    },
    {
      name: 'Apple AirPods Pro (2nd Gen, USB-C)',
      brand: 'Apple',
      category: 'Headphones',
      image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
      current_price: 22990,
      refurbished_price: 16990,
      rating: 4.8,
      processor: 'Apple H2 Headphone Chip + U1/U2 Ultra Wideband in Case',
      ram: 'N/A',
      storage: 'N/A',
      display: 'N/A (Force Sensor & Touch Swipe Volume)',
      display_type: 'Capacitive Stem Swipe & Squeeze Control',
      refresh_rate: 'N/A',
      battery: '6 hrs per charge (Up to 30 hrs with MagSafe USB-C Case)',
      charging_speed: 'MagSafe, Apple Watch Charger, Qi Wireless, USB-C (5 min gives 1 hr)',
      camera: 'Dual Beamforming Microphones + Inward-facing Mic for Adaptive EQ',
      front_camera: 'N/A',
      operating_system: 'Apple iOS / iPadOS / macOS Automatic Audio Switching',
      benchmark_score: 930000,
      weight: '5.3 g per earbud, 50.8 g case (IP54 Dust/Sweat/Water Resistant)',
      connectivity: 'Bluetooth 5.3, Personalized Spatial Audio with Dynamic Head Tracking'
    },
    {
      name: 'Apple Watch Series 9 GPS (45mm)',
      brand: 'Apple',
      category: 'Smartwatches',
      image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
      current_price: 41900,
      refurbished_price: 31900,
      rating: 4.7,
      processor: 'Apple S9 SiP (64-bit dual core, 4-core Neural Engine)',
      ram: '1 GB',
      storage: '64 GB Internal Storage',
      display: '1.9-inch Always-On Retina LTPO OLED (396 x 484)',
      display_type: 'OLED Edge-to-Edge (Peak 2000 nits, Ion-X Front Glass)',
      refresh_rate: '60 Hz Dynamic',
      battery: '18 hours all-day normal (36 hours Low Power Mode)',
      charging_speed: 'Fast Magnetic USB-C Charger (0 to 80% in 45 min)',
      camera: 'N/A (Electrical ECG Sensor, SpO2 Blood Oxygen, Wrist Temp)',
      front_camera: 'N/A',
      operating_system: 'watchOS 10 with Double Tap One-handed Gesture',
      benchmark_score: 870000,
      weight: '38.7 g (100% Recycled Aluminum, 50m Water Resistant, IP6X)',
      connectivity: 'GPS (L1), Wi-Fi 4, Bluetooth 5.3, Ultra Wideband 2 (UWB), NFC'
    },
    {
      name: 'Samsung Galaxy Watch 6 Classic (47mm)',
      brand: 'Samsung',
      category: 'Smartwatches',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      current_price: 33999,
      refurbished_price: 24999,
      rating: 4.5,
      processor: 'Exynos W930 Dual-core 1.4GHz (5nm Architecture)',
      ram: '2 GB',
      storage: '16 GB eMMC',
      display: '1.5-inch Super AMOLED with Physical Rotating Bezel',
      display_type: 'Sapphire Crystal (480 x 480, Peak 2000 nits Always-On)',
      refresh_rate: '60 Hz',
      battery: '425 mAh Li-Ion (Up to 40 hours with AOD off)',
      charging_speed: '10W Fast Wireless WPC Qi Charging',
      camera: 'N/A (Samsung BioActive Sensor: Optical Heart + ECG + BIA Body Composition)',
      front_camera: 'N/A',
      operating_system: 'Wear OS 4 Powered by Samsung (One UI 5 Watch)',
      benchmark_score: 790000,
      weight: '59 g (Stainless Steel, IP68, 5ATM Water, MIL-STD-810H)',
      connectivity: 'GPS/Glonass, Wi-Fi dual-band, Bluetooth 5.3, NFC Samsung Wallet'
    },
    {
      name: 'Nothing Phone (2) (256GB)',
      brand: 'Nothing',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
      current_price: 36999,
      refurbished_price: 27999,
      rating: 4.4,
      processor: 'Snapdragon 8+ Gen 1 (4nm Octa-core, Adreno 730)',
      ram: '12 GB LPDDR5',
      storage: '256 GB UFS 3.1',
      display: '6.7-inch Flexible LTPO OLED (2412 x 1080)',
      display_type: 'FHD+ OLED (Peak 1600 nits, HDR10+, 10-bit Color)',
      refresh_rate: '120 Hz Adaptive Dynamic (1-120Hz)',
      battery: '4700 mAh Li-Ion',
      charging_speed: '45W Wired (100% in 55 min), 15W Qi Wireless, 5W Reverse Wireless',
      camera: '50MP Sony IMX890 (f/1.88 OIS) + 50MP Samsung JN1 Ultra-wide 114°',
      front_camera: '32MP Sony IMX615 (f/2.45)',
      operating_system: 'Nothing OS 2.5 (Android 14) with Glyph LED Interface',
      benchmark_score: 1290000,
      weight: '201.2 g (Recycled Aluminum & Curved Glass, IP54)',
      connectivity: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C 2.0, NFC'
    },
    {
      name: 'OnePlus Watch 2 (Smartwatch)',
      brand: 'OnePlus',
      category: 'Smartwatches',
      image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
      current_price: 24999,
      refurbished_price: 18499,
      rating: 4.6,
      processor: 'Dual-Engine: Snapdragon W5 Gen 1 + BES2700 Efficiency Coprocessor',
      ram: '2 GB',
      storage: '32 GB eMMC',
      display: '1.43-inch AMOLED 2.5D Sapphire Crystal',
      display_type: 'AMOLED (466 x 466, Peak 1000 nits High Brightness Mode)',
      refresh_rate: '60 Hz',
      battery: '500 mAh (100 Hours Smart Mode, 12 Days Power Saver Mode)',
      charging_speed: '7.5W VOOC Fast Charging (100% in 45 min, 10 min gives 24 hrs)',
      camera: 'N/A (Optical Heart Rate + SpO2 + Dual-Frequency L1+L5 GPS)',
      front_camera: 'N/A',
      operating_system: 'Wear OS 4 + RTOS Dual Engine OS Architecture',
      benchmark_score: 810000,
      weight: '49 g (Stainless Steel Chassis, MIL-STD-810H, 5ATM IP68)',
      connectivity: 'Dual Frequency GPS (L1+L5), Wi-Fi, Bluetooth 5.0, NFC Google Wallet'
    },
    {
      name: 'Sony WF-1000XM5 True Wireless Earbuds',
      brand: 'Sony',
      category: 'Headphones',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      current_price: 23990,
      refurbished_price: 17490,
      rating: 4.6,
      processor: 'Dual Processor: Integrated Processor V2 + HD NC Processor QN2e',
      ram: 'N/A',
      storage: 'N/A',
      display: 'N/A (Precise Capacitive Touch Tap Surface)',
      display_type: 'Capacitive Tap Sensors with Auto Pause Sensors',
      refresh_rate: 'N/A',
      battery: '8 hrs ANC on (24 hrs with Qi Wireless Charging Case)',
      charging_speed: 'Quick Charge (3 min gives 60 min Playback), Qi Wireless Compatible',
      camera: '6 Microphones with Bone Conduction & Deep Neural Network (DNN) AI Filter',
      front_camera: 'N/A',
      operating_system: 'Sony Headphones Connect App (iOS & Android)',
      benchmark_score: 920000,
      weight: '5.9 g per earbud (IPX4 Water Resistant)',
      connectivity: 'Bluetooth 5.3, LDAC Hi-Res Wireless, Multipoint 2 Devices Simultaneously'
    }
  ];

  const insertedProducts = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const targetId = i + 1;
    await db.run(`
      INSERT INTO products (
        id, name, brand, category, image_url, current_price, refurbished_price, rating,
        processor, ram, storage, display, display_type, refresh_rate,
        battery, charging_speed, camera, front_camera, operating_system,
        benchmark_score, weight, connectivity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      targetId, p.name, p.brand, p.category, p.image_url, p.current_price, p.refurbished_price, p.rating,
      p.processor, p.ram, p.storage, p.display, p.display_type, p.refresh_rate,
      p.battery, p.charging_speed, p.camera, p.front_camera, p.operating_system,
      p.benchmark_score, p.weight, p.connectivity
    ]);
    insertedProducts.push({ id: targetId, ...p });
  }

  console.log(`Inserted ${insertedProducts.length} verified products with IDs 1 to ${insertedProducts.length}.`);

  // Generate 90 days of consistent historical daily prices
  console.log('Generating customized 90-day price trends across retailers...');
  const baseDate = new Date('2026-11-17T00:00:00Z');

  for (const prod of insertedProducts) {
    const baselinePrice = prod.current_price;

    for (let dayOffset = 89; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(baseDate);
      currentDate.setUTCDate(baseDate.getUTCDate() - dayOffset);
      const dateStr = currentDate.toISOString().split('T')[0];

      let dailyBaseMultiplier = 1.0;

      // DEMO SCENARIO CUSTOMIZATION:
      // Product 4: OnePlus 12 -> "GREAT DEAL - BUY NOW"
      // Traded at ~₹70,500 over past 80 days, then recent aggressive retailer drop to ₹64,999 (~-7.5% vs 90d MA)
      if (prod.id === 4) {
        if (dayOffset > 7) {
          // Historical baseline ~ 1.085x (approx ₹70,500)
          dailyBaseMultiplier = 1.085 + (Math.sin(dayOffset * 0.3) * 0.015);
        } else {
          // Recent 7 days drop to contemporary deal price
          dailyBaseMultiplier = 1.0 - (0.015 * (7 - dayOffset) / 7);
        }
      }
      // Product 3: Google Pixel 8 -> "FAIR PRICE"
      // Very stable, hovering gently within [-1.5%, +1.5%] corridor of baseline ₹61,999
      else if (prod.id === 3) {
        dailyBaseMultiplier = 1.002 + (Math.sin(dayOffset * 0.25) * 0.018);
      }
      // Product 7: Dell XPS 13 Plus -> "WAIT - LIKELY TO DROP"
      // Traded at ₹125,000 for 75 days, then recent surcharge to ₹134,990 (+6.8% vs MA)
      else if (prod.id === 7) {
        if (dayOffset > 10) {
          dailyBaseMultiplier = 0.93 + (Math.sin(dayOffset * 0.2) * 0.012);
        } else {
          dailyBaseMultiplier = 1.0 + (Math.cos(dayOffset * 0.4) * 0.01);
        }
      }
      // Other products standard realistic curve
      else {
        const daysFromStart = 89 - dayOffset;
        const seasonalDip = Math.sin((daysFromStart / 90) * Math.PI * 3) * 0.03;
        const midSale = (dayOffset >= 38 && dayOffset <= 43) ? -0.06 : 0;
        const smallNoise = Math.sin(prod.id * 77 + dayOffset * 13) * 0.015;
        dailyBaseMultiplier = 1.0 + seasonalDip + midSale + smallNoise;
      }

      // Retailer variations
      // Amazon
      const amazonMult = dailyBaseMultiplier * (1 + (Math.sin(prod.id * 11 + dayOffset) * 0.008));
      const amazonPrice = Math.round((baselinePrice * amazonMult) / 50) * 50;

      // Flipkart
      const flipkartMult = dailyBaseMultiplier * (0.996 + (Math.cos(prod.id * 19 + dayOffset) * 0.01));
      const flipkartPrice = Math.round((baselinePrice * flipkartMult) / 50) * 50;

      // Direct Brand Store
      const brandMult = dailyBaseMultiplier * (1.02 + (Math.sin(dayOffset * 0.15) * 0.006));
      const brandPrice = Math.round((baselinePrice * brandMult) / 50) * 50;

      await db.run('INSERT INTO price_history (product_id, retailer_id, price, recorded_at) VALUES (?, ?, ?, ?)', [prod.id, 1, amazonPrice, dateStr]);
      await db.run('INSERT INTO price_history (product_id, retailer_id, price, recorded_at) VALUES (?, ?, ?, ?)', [prod.id, 2, flipkartPrice, dateStr]);
      await db.run('INSERT INTO price_history (product_id, retailer_id, price, recorded_at) VALUES (?, ?, ?, ?)', [prod.id, 3, brandPrice, dateStr]);
    }
  }

  console.log('Price history generated (4,320 records across 16 products x 3 retailers x 90 days).');

  // Insert sales events
  console.log('Inserting sales events...');
  const salesEvents = [
    {
      title: 'Republic Day Electronics Gala',
      period: 'January 20 – January 26, 2027',
      discount_range: 'Up to 35% Off on Flagships & Laptops',
      type: 'Historically Recurring',
      description: 'Annual national winter shopping festival across Amazon and Flipkart with verified instant bank discounts on OnePlus, Google, and Apple.',
      status: 'Upcoming'
    },
    {
      title: 'Summer Mega Savings Days',
      period: 'May 3 – May 8, 2027',
      discount_range: 'Up to 25% Off on Audio & Wearables',
      type: 'Historically Recurring',
      description: 'Summer season electronics refresh with deep promotional pricing on Sony ANC headphones, Bose, and premium smartwatches.',
      status: 'Upcoming'
    },
    {
      title: 'Independence Day Freedom Fest',
      period: 'August 6 – August 12, 2027',
      discount_range: 'Up to 30% Off + Exchange Bonuses',
      type: 'Historically Recurring',
      description: 'Mid-year stock clearance prior to the autumn flagship launch cycle. High exchange trade-in bonuses on older laptops and smartphones.',
      status: 'Upcoming'
    },
    {
      title: 'Diwali Big Billion Days / Great Indian Festival',
      period: 'October 14 – October 22, 2027',
      discount_range: 'Annual Lowest Price Points (Up to 45% Off)',
      type: 'Historically Recurring',
      description: 'Peak e-commerce shopping festival of the year with confirmed lowest price records on MacBook Air, iPhone 15, and OLED laptops.',
      status: 'Upcoming'
    },
    {
      title: 'Year-End Stock Clearance Sale',
      period: 'December 24 – December 31, 2026',
      discount_range: 'Up to 40% Off on Previous-Gen Gadgets',
      type: 'Scheduled',
      description: 'Official year-end warehouse clearance by direct brand stores and online retailers before next-generation product revisions arrive.',
      status: 'Upcoming'
    }
  ];

  for (const s of salesEvents) {
    await db.run(`
      INSERT INTO sales_events (title, period, discount_range, type, description, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [s.title, s.period, s.discount_range, s.type, s.description, s.status]);
  }

  // Insert Price Alerts tailored for Hackathon Demo:
  // Alert 1: Google Pixel 8 (Product 3) -> ACTIVE target at ₹58,000 (Current is ₹61,999).
  // Demonstrator clicks "Simulate Flash Drop" -> drops to ₹55,799 -> triggers LIVE!
  // Alert 2: iPhone 15 (Product 1) -> TRIGGERED target at ₹68,000 (Current is ₹66,999).
  // Shows red notification badge immediately on page load!
  // Alert 3: OnePlus 12 (Product 4) -> ACTIVE target at ₹62,000.
  console.log('Inserting tailored demonstration price alerts...');
  await db.run(`
    INSERT INTO price_alerts (product_id, target_price, user_email, status, created_at, triggered_at)
    VALUES (?, ?, ?, ?, datetime('now', '-3 days'), datetime('now', '-2 hours'))
  `, [1, 68000, 'shopper@specsense.io', 'TRIGGERED']);

  await db.run(`
    INSERT INTO price_alerts (product_id, target_price, user_email, status, created_at)
    VALUES (?, ?, ?, ?, datetime('now', '-1 days'))
  `, [3, 58000, 'evaluator@hackathon.org', 'ACTIVE']);

  await db.run(`
    INSERT INTO price_alerts (product_id, target_price, user_email, status, created_at)
    VALUES (?, ?, ?, ?, datetime('now', '-4 hours'))
  `, [4, 62000, 'techbuyer@specsense.io', 'ACTIVE']);

  console.log('--- SpecSense Database Seeded Successfully for Demo ---');
}

seed().catch(err => {
  console.error('Seed failure:', err);
  process.exit(1);
});
