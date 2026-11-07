// SAMPLE DATA — adapted from docs/appendix/B_DEMO_INVENTORY.json.
// These are illustrative demo listings, NOT Carlay's live inventory. Prices, kilometres,
// dates and histories are invented. Photos are licensed Wikimedia Commons images (see credits).
import type { VehicleSeed } from '../types'

export const seedVehicles: VehicleSeed[] = [
  {
    "id": "CL-0001",
    "stockCode": "CL-0001",
    "slug": "hyundai-creta-sx-o-turbo-dct-2021-k7m2",
    "make": "Hyundai",
    "model": "Creta",
    "variant": "SX (O) 1.4 Turbo DCT",
    "bodyType": "suv",
    "seats": 5,
    "mfgYear": 2021,
    "mfgMonth": 9,
    "regYear": 2021,
    "regMonth": 11,
    "rto": "MH12",
    "regValidUntil": "2036-11-30",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DCT",
    "engineCc": 1353,
    "colour": "Orange with black roof",
    "km": 41200,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-08-14",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 1325000,
    "priceType": "fixed",
    "status": "available",
    "featured": true,
    "addedDaysAgo": 2,
    "headline": "One owner, turbo petrol with a smooth DCT",
    "description": "A single-owner Creta in the sought-after SX (O) trim with the 1.4 turbo petrol and dual-clutch automatic. Serviced at authorised workshops with the full history on file, and kept in a covered parking bay. Comfortable for Pune traffic and effortless on the expressway.",
    "highlights": [
      "1st owner · 41,200 km",
      "Turbo petrol with DCT",
      "Panoramic sunroof",
      "Full authorised service history"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "safety",
        "label": "ABS with EBD"
      },
      {
        "group": "safety",
        "label": "Reverse camera"
      },
      {
        "group": "comfort",
        "label": "Cruise control"
      },
      {
        "group": "comfort",
        "label": "Automatic climate control"
      },
      {
        "group": "exterior",
        "label": "Panoramic sunroof"
      },
      {
        "group": "infotainment",
        "label": "Touchscreen with Apple CarPlay & Android Auto"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "odometer",
      "service_history"
    ],
    "images": [
      {
        "local": "/demo/CL-0001-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2022_Hyundai_Creta_1.5_IVT_orange_and_black_front_view_in_Brunei.jpg/1920px-2022_Hyundai_Creta_1.5_IVT_orange_and_black_front_view_in_Brunei.jpg",
        "alt": "Hyundai Creta in orange with black roof, front three-quarter view"
      },
      {
        "local": "/demo/CL-0001-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/HYUNDAI_CRETA_%2C_iX25_%28SU2%29_China_%284%29.jpg/1920px-HYUNDAI_CRETA_%2C_iX25_%28SU2%29_China_%284%29.jpg",
        "alt": "Hyundai Creta side and rear three-quarter view"
      }
    ]
  },
  {
    "id": "CL-0002",
    "stockCode": "CL-0002",
    "slug": "volkswagen-polo-gt-tsi-12-dsg-2018-p4q8",
    "make": "Volkswagen",
    "model": "Polo",
    "variant": "GT TSI 1.2 DSG",
    "bodyType": "hatchback",
    "seats": 5,
    "mfgYear": 2018,
    "mfgMonth": 2,
    "regYear": 2018,
    "regMonth": 4,
    "rto": "MH14",
    "regValidUntil": "2033-04-30",
    "owners": 2,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DSG",
    "engineCc": 1197,
    "km": 52300,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-04-09",
    "accidentHistory": "none",
    "serviceHistory": "partial",
    "keys": 2,
    "price": 695000,
    "priceType": "negotiable",
    "status": "available",
    "featured": false,
    "addedDaysAgo": 7,
    "headline": "The fun hatchback with a 7-speed DSG",
    "description": "A well-kept Polo GT TSI with the punchy 1.2 turbo petrol and 7-speed DSG. Second owner, regular servicing with a few gaps in the book that we are happy to walk you through. A genuine driver's hatchback at a sensible price.",
    "highlights": [
      "Turbo petrol with 7-speed DSG",
      "2nd owner · 52,300 km",
      "Comprehensive insurance valid to Apr 2027"
    ],
    "features": [
      {
        "group": "safety",
        "label": "Dual airbags"
      },
      {
        "group": "safety",
        "label": "ABS with EBD"
      },
      {
        "group": "comfort",
        "label": "Climate control"
      },
      {
        "group": "comfort",
        "label": "Rear parking sensors"
      },
      {
        "group": "infotainment",
        "label": "Touchscreen infotainment"
      },
      {
        "group": "exterior",
        "label": "Alloy wheels"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance"
    ],
    "images": [
      {
        "local": "/demo/CL-0002-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Volkswagen_Polo_GT_TSI_in_rain_on_an_Indian_street.jpg/1920px-Volkswagen_Polo_GT_TSI_in_rain_on_an_Indian_street.jpg",
        "alt": "Volkswagen Polo GT TSI on an Indian street"
      }
    ]
  },
  {
    "id": "CL-0003",
    "stockCode": "CL-0003",
    "slug": "skoda-slavia-style-15-tsi-dsg-2022-t6w3",
    "make": "Škoda",
    "model": "Slavia",
    "variant": "Style 1.5 TSI DSG",
    "bodyType": "sedan",
    "seats": 5,
    "mfgYear": 2022,
    "mfgMonth": 8,
    "regYear": 2022,
    "regMonth": 10,
    "rto": "MH12",
    "regValidUntil": "2037-10-31",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DSG",
    "engineCc": 1498,
    "km": 29800,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-10-09",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 1295000,
    "priceType": "fixed",
    "status": "available",
    "featured": true,
    "addedDaysAgo": 1,
    "headline": "Spacious sedan, 1.5 TSI with a 7-speed DSG",
    "description": "A one-owner Slavia in Style trim with the 1.5 TSI and 7-speed DSG. Low usage, authorised-service history and a cabin that feels a size above its price. Ready to drive away after paperwork.",
    "highlights": [
      "1st owner · 29,800 km",
      "1.5 TSI + 7-speed DSG",
      "Authorised service history"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "safety",
        "label": "ESC and traction control"
      },
      {
        "group": "comfort",
        "label": "Ventilated front seats"
      },
      {
        "group": "comfort",
        "label": "Cruise control"
      },
      {
        "group": "exterior",
        "label": "Electric sunroof"
      },
      {
        "group": "infotainment",
        "label": "10-inch touchscreen with wireless connectivity"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "odometer"
    ],
    "images": [
      {
        "local": "/demo/CL-0003-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Skoda_Slavia_Side_view.jpg/1920px-Skoda_Slavia_Side_view.jpg",
        "alt": "Škoda Slavia side view"
      }
    ]
  },
  {
    "id": "CL-0004",
    "stockCode": "CL-0004",
    "slug": "honda-city-zx-cvt-2022-h8d5",
    "make": "Honda",
    "model": "City",
    "variant": "ZX CVT",
    "bodyType": "sedan",
    "seats": 5,
    "mfgYear": 2022,
    "mfgMonth": 3,
    "regYear": 2022,
    "regMonth": 4,
    "rto": "MH12",
    "regValidUntil": "2037-04-30",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "CVT",
    "engineCc": 1498,
    "km": 38500,
    "insuranceType": "zero_dep",
    "insuranceValidUntil": "2027-04-04",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 1125000,
    "priceType": "negotiable",
    "status": "available",
    "featured": false,
    "addedDaysAgo": 9,
    "headline": "Refined City with zero-depreciation cover",
    "description": "The fifth-generation City in top ZX trim with the smooth i-VTEC engine and CVT. One owner, authorised servicing and a zero-depreciation insurance policy that is transferable subject to the insurer. A calm, comfortable family sedan.",
    "highlights": [
      "1st owner · 38,500 km",
      "Zero-dep insurance valid to Apr 2027",
      "Top ZX trim with sunroof"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "safety",
        "label": "Lane-watch camera"
      },
      {
        "group": "comfort",
        "label": "Paddle shifters"
      },
      {
        "group": "comfort",
        "label": "Automatic climate control"
      },
      {
        "group": "exterior",
        "label": "Electric sunroof"
      },
      {
        "group": "infotainment",
        "label": "8-inch touchscreen"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance"
    ],
    "images": [
      {
        "local": "/demo/CL-0004-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Honda_City_1.5_S_2022.jpg/1920px-Honda_City_1.5_S_2022.jpg",
        "alt": "Honda City sedan, front three-quarter view"
      },
      {
        "local": "/demo/CL-0004-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/HONDA_CITY_%28GM2%2C3%29_China_%282%29.jpg/1920px-HONDA_CITY_%28GM2%2C3%29_China_%282%29.jpg",
        "alt": "Honda City sedan, rear three-quarter view"
      }
    ]
  },
  {
    "id": "CL-0005",
    "stockCode": "CL-0005",
    "slug": "jeep-compass-limited-o-20-diesel-4x4-at-2022-c9v1",
    "make": "Jeep",
    "model": "Compass",
    "variant": "Limited (O) 2.0 Diesel 4x4 AT",
    "bodyType": "suv",
    "seats": 5,
    "mfgYear": 2022,
    "mfgMonth": 7,
    "regYear": 2022,
    "regMonth": 8,
    "rto": "MH12",
    "regValidUntil": "2037-08-31",
    "owners": 1,
    "fuel": "diesel",
    "transmission": "automatic",
    "transmissionDetail": "TC",
    "engineCc": 1956,
    "km": 55300,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-08-10",
    "accidentHistory": "minor",
    "accidentNotes": "Front bumper repainted after a parking scrape; no structural damage reported.",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 2150000,
    "priceType": "negotiable",
    "status": "available",
    "featured": false,
    "addedDaysAgo": 6,
    "headline": "4x4 diesel automatic with honest paperwork",
    "description": "A one-owner Compass 4x4 diesel automatic that has covered its distance on highways. A repainted front bumper is disclosed in the listing and we encourage you to inspect it. Authorised service history; strong for long drives and monsoon roads.",
    "highlights": [
      "4x4 diesel automatic",
      "1st owner · 55,300 km",
      "Minor bumper repaint disclosed"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "safety",
        "label": "Hill-start assist"
      },
      {
        "group": "comfort",
        "label": "Dual-zone climate control"
      },
      {
        "group": "comfort",
        "label": "Powered tailgate"
      },
      {
        "group": "exterior",
        "label": "Panoramic sunroof"
      },
      {
        "group": "infotainment",
        "label": "10.1-inch touchscreen"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "accident_history"
    ],
    "images": [
      {
        "local": "/demo/CL-0005-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/JEEP_COMPASS_%28MP%29_China_%282%29.jpg/1920px-JEEP_COMPASS_%28MP%29_China_%282%29.jpg",
        "alt": "Jeep Compass front three-quarter view"
      },
      {
        "local": "/demo/CL-0005-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/JEEP_COMPASS_%28MP%29_China.jpg/1920px-JEEP_COMPASS_%28MP%29_China.jpg",
        "alt": "Jeep Compass side view"
      }
    ]
  },
  {
    "id": "CL-0006",
    "stockCode": "CL-0006",
    "slug": "mahindra-xuv700-ax7-l-diesel-at-awd-2023-x2m7",
    "make": "Mahindra",
    "model": "XUV700",
    "variant": "AX7 L Diesel AT AWD 7-Seater",
    "bodyType": "suv",
    "seats": 7,
    "mfgYear": 2023,
    "mfgMonth": 1,
    "regYear": 2023,
    "regMonth": 2,
    "rto": "MH12",
    "regValidUntil": "2038-02-28",
    "owners": 1,
    "fuel": "diesel",
    "transmission": "automatic",
    "transmissionDetail": "TC",
    "engineCc": 2184,
    "km": 28400,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-02-01",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 2275000,
    "priceType": "fixed",
    "status": "reserved",
    "featured": false,
    "addedDaysAgo": 14,
    "headline": "Top-spec AX7 L, AWD diesel automatic",
    "description": "Top-of-the-range XUV700 with AWD and the torque-converter automatic. Single owner, low kilometres, authorised servicing. This car is currently booked — enquire to be placed on the backup list.",
    "highlights": [
      "Top AX7 L, AWD",
      "1st owner · 28,400 km",
      "7-seater"
    ],
    "features": [
      {
        "group": "safety",
        "label": "7 airbags"
      },
      {
        "group": "safety",
        "label": "ADAS suite"
      },
      {
        "group": "safety",
        "label": "360-degree camera"
      },
      {
        "group": "comfort",
        "label": "Ventilated front seats"
      },
      {
        "group": "exterior",
        "label": "Panoramic sunroof"
      },
      {
        "group": "infotainment",
        "label": "Dual 10.25-inch displays"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "odometer"
    ],
    "images": [
      {
        "local": "/demo/CL-0006-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/2023_Mahindra_XUV700_AX7L_front.jpg/1920px-2023_Mahindra_XUV700_AX7L_front.jpg",
        "alt": "Mahindra XUV700 AX7 L front view"
      },
      {
        "local": "/demo/CL-0006-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/2023_Mahindra_XUV700_AX7L_rear.jpg/1920px-2023_Mahindra_XUV700_AX7L_rear.jpg",
        "alt": "Mahindra XUV700 AX7 L rear view"
      }
    ]
  },
  {
    "id": "CL-0007",
    "stockCode": "CL-0007",
    "slug": "hyundai-venue-sx-o-10-turbo-dct-2021-v3r9",
    "make": "Hyundai",
    "model": "Venue",
    "variant": "SX (O) 1.0 Turbo DCT",
    "bodyType": "suv",
    "seats": 5,
    "mfgYear": 2021,
    "mfgMonth": 4,
    "regYear": 2021,
    "regMonth": 5,
    "rto": "MH14",
    "regValidUntil": "2036-05-31",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DCT",
    "engineCc": 998,
    "km": 36900,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-05-02",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 935000,
    "priceType": "negotiable",
    "status": "sold",
    "featured": false,
    "addedDaysAgo": 11,
    "headline": "Compact SUV, turbo petrol DCT",
    "description": "A single-owner Venue with the lively 1.0 turbo and DCT, ideal for city use with highway ability. Regular authorised servicing and a clean history.",
    "highlights": [
      "1st owner · 36,900 km",
      "1.0 turbo + DCT",
      "Sunroof and connected features"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "comfort",
        "label": "Cruise control"
      },
      {
        "group": "comfort",
        "label": "Automatic climate control"
      },
      {
        "group": "exterior",
        "label": "Electric sunroof"
      },
      {
        "group": "infotainment",
        "label": "8-inch touchscreen"
      }
    ],
    "verifiedFields": [],
    "images": [
      {
        "local": "/demo/CL-0007-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Hyundai_Venue_Elite%2C_2021_front.jpg/1920px-Hyundai_Venue_Elite%2C_2021_front.jpg",
        "alt": "Hyundai Venue front view"
      },
      {
        "local": "/demo/CL-0007-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Hyundai_Venue_%2852086106004%29.jpg/1920px-Hyundai_Venue_%2852086106004%29.jpg",
        "alt": "Hyundai Venue three-quarter view"
      }
    ]
  },
  {
    "id": "CL-0008",
    "stockCode": "CL-0008",
    "slug": "hyundai-i20-asta-o-10-turbo-dct-2021-i1n6",
    "make": "Hyundai",
    "model": "i20",
    "variant": "Asta (O) 1.0 Turbo DCT",
    "bodyType": "hatchback",
    "seats": 5,
    "mfgYear": 2021,
    "mfgMonth": 12,
    "regYear": 2022,
    "regMonth": 1,
    "rto": "MH12",
    "regValidUntil": "2037-01-31",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DCT",
    "engineCc": 998,
    "km": 24700,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-01-05",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 895000,
    "priceType": "fixed",
    "status": "reserved",
    "featured": false,
    "addedDaysAgo": 0,
    "headline": "Coming soon — low-km premium hatchback",
    "description": "A low-kilometre i20 in top Asta (O) trim, arriving at the showroom this week. Photographs and the inspection summary will be added after intake — register your interest to be told first.",
    "highlights": [
      "Coming soon",
      "1st owner · 24,700 km",
      "Top Asta (O) trim"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "comfort",
        "label": "Wireless charging"
      },
      {
        "group": "exterior",
        "label": "Electric sunroof"
      },
      {
        "group": "infotainment",
        "label": "10.25-inch touchscreen"
      }
    ],
    "verifiedFields": [],
    "images": [
      {
        "local": "/demo/CL-0008-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Hyundai_i20_%28BC3%29_IMG_4165.jpg/1920px-Hyundai_i20_%28BC3%29_IMG_4165.jpg",
        "alt": "Hyundai i20 front three-quarter view"
      },
      {
        "local": "/demo/CL-0008-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Hyundai_i20_%28BC3%29_IMG_4108.jpg/1920px-Hyundai_i20_%28BC3%29_IMG_4108.jpg",
        "alt": "Hyundai i20 rear three-quarter view"
      }
    ]
  },
  {
    "id": "CL-0009",
    "stockCode": "CL-0009",
    "slug": "tata-nexon-xz-plus-s-diesel-2019-n5k4",
    "make": "Tata",
    "model": "Nexon",
    "variant": "XZ+ (S) Diesel",
    "bodyType": "suv",
    "seats": 5,
    "mfgYear": 2019,
    "mfgMonth": 10,
    "regYear": 2019,
    "regMonth": 11,
    "rto": "MH12",
    "regValidUntil": "2034-11-30",
    "owners": 2,
    "fuel": "diesel",
    "transmission": "manual",
    "engineCc": 1497,
    "km": 61800,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2026-11-20",
    "accidentHistory": "none",
    "serviceHistory": "partial",
    "keys": 2,
    "price": 715000,
    "priceType": "fixed",
    "status": "sold",
    "featured": false,
    "addedDaysAgo": 46,
    "headline": "Sold — compact diesel SUV",
    "description": "This Nexon diesel has found a new home. Browse similar compact SUVs below or tell us what you are looking for and we will let you know when something suitable arrives.",
    "highlights": [
      "Sold on 24 Oct 2026"
    ],
    "features": [
      {
        "group": "safety",
        "label": "Dual airbags"
      },
      {
        "group": "comfort",
        "label": "Automatic climate control"
      },
      {
        "group": "infotainment",
        "label": "Touchscreen infotainment"
      }
    ],
    "verifiedFields": [],
    "images": [
      {
        "local": "/demo/CL-0009-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tata_Nexon_Blue_Dual_Tone.jpg/1920px-Tata_Nexon_Blue_Dual_Tone.jpg",
        "alt": "Tata Nexon in blue with white roof"
      },
      {
        "local": "/demo/CL-0009-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2018_Tata_Nexon_XM.jpg/1920px-2018_Tata_Nexon_XM.jpg",
        "alt": "Tata Nexon front three-quarter view"
      }
    ]
  },
  {
    "id": "CL-0010",
    "stockCode": "CL-0010",
    "slug": "bmw-3-series-330i-m-sport-2020-b7z2",
    "make": "BMW",
    "model": "3 Series",
    "variant": "330i M Sport",
    "bodyType": "sedan",
    "seats": 5,
    "mfgYear": 2019,
    "mfgMonth": 11,
    "regYear": 2020,
    "regMonth": 1,
    "rto": "MH12",
    "regValidUntil": "2035-01-31",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "TC",
    "engineCc": 1998,
    "km": 47600,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-01-12",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 3450000,
    "priceType": "negotiable",
    "status": "available",
    "featured": true,
    "addedDaysAgo": 4,
    "headline": "M Sport 330i with a published inspection summary",
    "description": "A single-owner 330i M Sport with the full authorised service record. This listing carries a sample inspection summary so you can see how Carlay presents condition findings: what was checked, what is fine and what needs attention.",
    "highlights": [
      "1st owner · 47,600 km",
      "Authorised service history",
      "Inspection summary available"
    ],
    "features": [
      {
        "group": "safety",
        "label": "6 airbags"
      },
      {
        "group": "safety",
        "label": "Parking assistant"
      },
      {
        "group": "comfort",
        "label": "Sport seats with memory"
      },
      {
        "group": "comfort",
        "label": "Ambient lighting"
      },
      {
        "group": "exterior",
        "label": "M Sport package and LED headlamps"
      },
      {
        "group": "infotainment",
        "label": "Curved display with navigation"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "odometer",
      "accident_history",
      "service_history"
    ],
    "images": [
      {
        "local": "/demo/CL-0010-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BMW_3-Series_%28G20%29_330i_%282020%29_%2852184513944%29.jpg/1920px-BMW_3-Series_%28G20%29_330i_%282020%29_%2852184513944%29.jpg",
        "alt": "BMW 3 Series 330i front three-quarter view"
      },
      {
        "local": "/demo/CL-0010-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/BMW_3-Series_%28G20%29_330i_%282023%29_%2853490165475%29.jpg/1920px-BMW_3-Series_%28G20%29_330i_%282023%29_%2853490165475%29.jpg",
        "alt": "BMW 3 Series 330i rear three-quarter view"
      }
    ]
  },
  {
    "id": "CL-0011",
    "stockCode": "CL-0011",
    "slug": "mercedes-benz-gla-200-2021-g4t8",
    "make": "Mercedes-Benz",
    "model": "GLA",
    "variant": "200",
    "bodyType": "suv",
    "seats": 5,
    "mfgYear": 2021,
    "mfgMonth": 9,
    "regYear": 2021,
    "regMonth": 11,
    "rto": "MH12",
    "regValidUntil": "2036-11-30",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DCT",
    "engineCc": 1332,
    "km": 32100,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-11-03",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 3290000,
    "priceType": "negotiable",
    "status": "available",
    "featured": false,
    "addedDaysAgo": 5,
    "headline": "Compact luxury SUV, single owner",
    "description": "A single-owner GLA 200 with the 1.3 turbo and 7G-DCT, serviced at the authorised workshop. Compact outside, premium inside.",
    "highlights": [
      "1st owner · 32,100 km",
      "Authorised service history",
      "Panoramic sunroof"
    ],
    "features": [
      {
        "group": "safety",
        "label": "7 airbags"
      },
      {
        "group": "comfort",
        "label": "Memory seats"
      },
      {
        "group": "comfort",
        "label": "Ambient lighting"
      },
      {
        "group": "exterior",
        "label": "Panoramic sunroof"
      },
      {
        "group": "infotainment",
        "label": "Twin 10.25-inch displays"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "odometer"
    ],
    "images": [
      {
        "local": "/demo/CL-0011-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Mercedes-Benz_GLA_200_%2850597134142%29.jpg/1920px-Mercedes-Benz_GLA_200_%2850597134142%29.jpg",
        "alt": "Mercedes-Benz GLA 200 front three-quarter view"
      },
      {
        "local": "/demo/CL-0011-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Mercedes-Benz_GLA-Klasse_%28H247%29_GLA_200_%282022%29_%2853986931284%29.jpg/1920px-Mercedes-Benz_GLA-Klasse_%28H247%29_GLA_200_%282022%29_%2853986931284%29.jpg",
        "alt": "Mercedes-Benz GLA 200 side view"
      }
    ]
  },
  {
    "id": "CL-0012",
    "stockCode": "CL-0012",
    "slug": "porsche-718-cayman-gts-40-2021-p9c1",
    "make": "Porsche",
    "model": "718 Cayman",
    "variant": "GTS 4.0",
    "bodyType": "coupe",
    "seats": 2,
    "mfgYear": 2021,
    "mfgMonth": 6,
    "regYear": 2021,
    "regMonth": 9,
    "rto": "MH02",
    "regValidUntil": "2036-09-30",
    "owners": 1,
    "fuel": "petrol",
    "transmission": "automatic",
    "transmissionDetail": "DCT",
    "engineCc": 3995,
    "km": 9800,
    "insuranceType": "comprehensive",
    "insuranceValidUntil": "2027-09-12",
    "accidentHistory": "none",
    "serviceHistory": "full_authorised",
    "keys": 2,
    "price": 12400000,
    "priceType": "on_request",
    "status": "available",
    "featured": true,
    "addedDaysAgo": 3,
    "headline": "Mid-engine, naturally aspirated flat-six, 9,800 km",
    "description": "A one-owner 718 Cayman GTS 4.0 with the naturally aspirated flat-six and PDK. Garage-kept, minimal use, full dealer history. Price on request — speak to us to arrange a private viewing.",
    "highlights": [
      "Naturally aspirated 4.0 flat-six",
      "1st owner · 9,800 km",
      "Full dealer history",
      "Private viewing by appointment"
    ],
    "features": [
      {
        "group": "safety",
        "label": "Porsche Stability Management"
      },
      {
        "group": "comfort",
        "label": "Sport Chrono package"
      },
      {
        "group": "comfort",
        "label": "18-way sport seats"
      },
      {
        "group": "exterior",
        "label": "20-inch alloy wheels"
      },
      {
        "group": "infotainment",
        "label": "PCM with navigation"
      }
    ],
    "verifiedFields": [
      "registration",
      "insurance",
      "odometer",
      "service_history"
    ],
    "images": [
      {
        "local": "/demo/CL-0012-1.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/2022_Porsche_718_Cayman_GTS_%2824806%29.jpg/1920px-2022_Porsche_718_Cayman_GTS_%2824806%29.jpg",
        "alt": "Porsche 718 Cayman GTS side view"
      },
      {
        "local": "/demo/CL-0012-2.jpg",
        "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Porsche_718_Cayman_GTS_4.0_%28982c%2C_2025%29_%2854871040356%29.jpg/1920px-Porsche_718_Cayman_GTS_4.0_%28982c%2C_2025%29_%2854871040356%29.jpg",
        "alt": "Porsche 718 Cayman GTS 4.0 front three-quarter view"
      }
    ]
  }
]
