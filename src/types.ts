export type Fuel = 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid'
export type Transmission = 'manual' | 'automatic'
export type BodyType = 'hatchback' | 'sedan' | 'suv' | 'muv' | 'coupe' | 'convertible'
export type Availability = 'available' | 'reserved' | 'sold'

export interface VehicleImage {
  local: string
  remote?: string
  alt: string
}

export interface VehicleFeature {
  group: string
  label: string
}

export interface VehicleSeed {
  id: string
  stockCode: string
  slug: string
  make: string
  model: string
  variant: string
  bodyType: string
  seats?: number
  mfgYear: number
  mfgMonth?: number
  regYear: number
  regMonth?: number
  rto?: string
  regValidUntil?: string
  owners: number
  fuel: string
  transmission: string
  transmissionDetail?: string
  engineCc?: number
  colour?: string
  km: number
  insuranceType?: string
  insuranceValidUntil?: string
  accidentHistory?: string
  accidentNotes?: string
  serviceHistory?: string
  keys?: number
  price: number
  priceType?: string
  status: string
  featured: boolean
  addedDaysAgo: number
  headline?: string
  description?: string
  highlights: string[]
  features: VehicleFeature[]
  verifiedFields: string[]
  images: VehicleImage[]
}

export interface Vehicle extends Omit<VehicleSeed, 'addedDaysAgo' | 'status' | 'fuel' | 'transmission' | 'bodyType'> {
  fuel: Fuel
  transmission: Transmission
  bodyType: BodyType
  status: Availability
  addedAt: string // ISO
  isSample: boolean
}

export const ENQUIRY_STATUSES = [
  'New',
  'Contacted',
  'Interested',
  'Test Drive Scheduled',
  'Negotiation',
  'Converted',
  'Lost',
] as const
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]

export const ENQUIRY_TYPES = ['General enquiry', 'Test drive', 'Price / negotiation', 'Finance', 'Exchange', 'Callback'] as const
export type EnquiryType = (typeof ENQUIRY_TYPES)[number]

export const ENQUIRY_SOURCES = ['Website', 'Instagram', 'WhatsApp', 'Phone call', 'Walk-in', 'Google Form'] as const
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number]

export interface Note {
  id: string
  at: string
  author: string
  text: string
}

export interface Enquiry {
  id: string
  ref: string
  name: string
  phone: string
  email?: string
  vehicleId?: string
  type: EnquiryType
  source: EnquirySource
  message?: string
  receivedAt: string
  assignee?: string
  status: EnquiryStatus
  followUp?: string // yyyy-mm-dd
  notes: Note[]
  isSimulated?: boolean
}

export const TEST_DRIVE_STATUSES = ['Pending', 'Approved', 'Completed', 'Cancelled'] as const
export type TestDriveStatus = (typeof TEST_DRIVE_STATUSES)[number]

export interface TestDrive {
  id: string
  ref: string
  vehicleId: string
  name: string
  phone: string
  email?: string
  date: string // yyyy-mm-dd
  slot: string
  notes?: string
  createdAt: string
  status: TestDriveStatus
  enquiryId?: string
  isSimulated?: boolean
}

export const SELL_STATUSES = ['New', 'Under Review', 'Contacted', 'Closed'] as const
export type SellStatus = (typeof SELL_STATUSES)[number]

export interface SellRequest {
  id: string
  ref: string
  brand: string
  model: string
  variant?: string
  mfgYear: number
  regYear: number
  km: number
  fuel: Fuel
  transmission: Transmission
  owners: string
  askingPrice?: number
  accidentHistory: string
  serviceHistory: string
  insuranceValid: string
  registrationValid: string
  loan: string
  conditionNotes?: string
  photos: string[] // data URLs (demo) or URLs
  photoCount: number
  name: string
  phone: string
  email?: string
  preferredContact: string
  createdAt: string
  status: SellStatus
  notes: Note[]
  isSimulated?: boolean
}

export const SOURCING_STATUSES = ['New', 'Searching', 'Match Shared', 'Closed'] as const
export type SourcingStatus = (typeof SOURCING_STATUSES)[number]

export interface SourcingRequest {
  id: string
  ref: string
  makeModel: string
  budgetMin?: number
  budgetMax: number
  yearFrom?: number
  maxKm?: number
  fuel: string
  transmission: string
  requirements?: string
  name: string
  phone: string
  email?: string
  createdAt: string
  status: SourcingStatus
  notes: Note[]
  isSimulated?: boolean
}

export type ActivityKind = 'enquiry' | 'testdrive' | 'sell' | 'sourcing' | 'inventory'
export interface Activity {
  id: string
  at: string
  kind: ActivityKind
  text: string
  link?: string
}
