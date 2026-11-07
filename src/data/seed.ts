// SAMPLE DATA — fictional customers, phone numbers (+91 90000 xxxxx series) and emails (example.com).
// Dates are generated relative to "now" so the demo always looks current.
import type { Activity, Enquiry, SellRequest, SourcingRequest, TestDrive, Vehicle } from '../types'
import { seedVehicles } from './vehicles'
import { daysAgo, daysFromNowYmd, minutesAgo } from '../lib/dates'

export const TEAM = ['Rahul (Sales)', 'Pooja (Sales)', 'Amit (Operations)'] as const

export const TIME_SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

export interface DemoState {
  vehicles: Vehicle[]
  enquiries: Enquiry[]
  testDrives: TestDrive[]
  sellRequests: SellRequest[]
  sourcingRequests: SourcingRequest[]
  activity: Activity[]
  version: number
}

const note = (id: string, at: string, author: string, text: string) => ({ id, at, author, text })

export function buildSeed(): DemoState {
  const vehicles: Vehicle[] = seedVehicles.map(({ addedDaysAgo, ...v }) => ({
    ...v,
    fuel: v.fuel as Vehicle['fuel'],
    transmission: v.transmission as Vehicle['transmission'],
    bodyType: v.bodyType as Vehicle['bodyType'],
    status: v.status as Vehicle['status'],
    addedAt: daysAgo(addedDaysAgo, 10),
    isSample: true,
  }))

  const enquiries: Enquiry[] = [
    { id: 'e1', ref: 'EN-0101', name: 'Aarav Kulkarni', phone: '+91 90000 00101', email: 'aarav.k@example.com', vehicleId: 'CL-0001', type: 'Test drive', source: 'Website', message: 'Is the Creta available this weekend for a test drive? I can come on Saturday morning.', receivedAt: minutesAgo(18), status: 'New', notes: [], followUp: daysFromNowYmd(0) },
    { id: 'e2', ref: 'EN-0102', name: 'Priya Deshpande', phone: '+91 90000 00102', email: 'priya.d@example.com', vehicleId: 'CL-0003', type: 'General enquiry', source: 'Instagram', message: 'Saw the Slavia reel. Is the price negotiable and is the insurance transferable?', receivedAt: minutesAgo(190), assignee: 'Pooja (Sales)', status: 'Contacted', followUp: daysFromNowYmd(1), notes: [note('n1', minutesAgo(150), 'Pooja (Sales)', 'Called — interested, wants to see it on Sunday. Shared insurance details on WhatsApp.')] },
    { id: 'e3', ref: 'EN-0103', name: 'Rohit Joshi', phone: '+91 90000 00103', vehicleId: 'CL-0010', type: 'Finance', source: 'Website', message: 'What would the EMI look like over 5 years with ₹8 lakh down payment?', receivedAt: daysAgo(1, 15), assignee: 'Rahul (Sales)', status: 'Interested', followUp: daysFromNowYmd(-1), notes: [note('n2', daysAgo(1, 17), 'Rahul (Sales)', 'Needs finance options. Collect salary slips before referring to a lender (to be confirmed with Carlay).')] },
    { id: 'e4', ref: 'EN-0104', name: 'Neha Patil', phone: '+91 90000 00104', email: 'neha.patil@example.com', vehicleId: 'CL-0006', type: 'Price / negotiation', source: 'WhatsApp', message: 'Please add me to the backup list if the current booking falls through.', receivedAt: daysAgo(2, 12), assignee: 'Rahul (Sales)', status: 'Negotiation', followUp: daysFromNowYmd(2), notes: [] },
    { id: 'e5', ref: 'EN-0105', name: 'Siddharth Mehta', phone: '+91 90000 00105', vehicleId: 'CL-0012', type: 'Test drive', source: 'Phone call', message: 'Would like to see the Cayman with my family.', receivedAt: daysAgo(1, 11), assignee: 'Pooja (Sales)', status: 'Test Drive Scheduled', followUp: daysFromNowYmd(1), notes: [note('n3', daysAgo(1, 12), 'Pooja (Sales)', 'Test drive booked — see Test Drives.')] },
    { id: 'e6', ref: 'EN-0106', name: 'Ananya Rao', phone: '+91 90000 00106', email: 'ananya.rao@example.com', vehicleId: 'CL-0009', type: 'General enquiry', source: 'Instagram', receivedAt: daysAgo(14, 10), assignee: 'Rahul (Sales)', status: 'Converted', notes: [note('n4', daysAgo(10, 16), 'Rahul (Sales)', 'Sale closed. Handover done.')] },
    { id: 'e7', ref: 'EN-0107', name: 'Vikram Shinde', phone: '+91 90000 00107', vehicleId: 'CL-0005', type: 'Exchange', source: 'Walk-in', message: 'Wants to exchange a 2017 Mahindra Scorpio against the Compass.', receivedAt: daysAgo(3, 13), assignee: 'Amit (Operations)', status: 'Contacted', followUp: daysFromNowYmd(0), notes: [] },
    { id: 'e8', ref: 'EN-0108', name: 'Kavya Iyer', phone: '+91 90000 00108', email: 'kavya.iyer@example.com', vehicleId: 'CL-0011', type: 'Callback', source: 'Website', message: 'Please call after 6 pm.', receivedAt: minutesAgo(75), status: 'New', notes: [] },
    { id: 'e9', ref: 'EN-0109', name: 'Arjun Bhosale', phone: '+91 90000 00109', vehicleId: 'CL-0002', type: 'Price / negotiation', source: 'Google Form', message: 'Best price for the Polo?', receivedAt: daysAgo(6, 18), assignee: 'Pooja (Sales)', status: 'Lost', notes: [note('n5', daysAgo(4, 11), 'Pooja (Sales)', 'Bought elsewhere.')] },
    { id: 'e10', ref: 'EN-0110', name: 'Meera Gokhale', phone: '+91 90000 00110', vehicleId: 'CL-0004', type: 'Test drive', source: 'Website', receivedAt: daysAgo(2, 16), assignee: 'Rahul (Sales)', status: 'Test Drive Scheduled', followUp: daysFromNowYmd(3), notes: [] },
    { id: 'e11', ref: 'EN-0111', name: 'Karan Malhotra', phone: '+91 90000 00111', email: 'karan.m@example.com', vehicleId: 'CL-0010', type: 'General enquiry', source: 'Instagram', message: 'Has the BMW had any paint work?', receivedAt: minutesAgo(320), status: 'New', notes: [], followUp: daysFromNowYmd(0) },
    { id: 'e12', ref: 'EN-0112', name: 'Ishita Sharma', phone: '+91 90000 00112', vehicleId: 'CL-0007', type: 'General enquiry', source: 'WhatsApp', receivedAt: daysAgo(9, 12), assignee: 'Amit (Operations)', status: 'Interested', followUp: daysFromNowYmd(-2), notes: [note('n6', daysAgo(8, 12), 'Amit (Operations)', 'Venue already sold — suggest similar compact SUVs.')] },
  ]

  const testDrives: TestDrive[] = [
    { id: 't1', ref: 'TD-0201', vehicleId: 'CL-0012', name: 'Siddharth Mehta', phone: '+91 90000 00105', date: daysFromNowYmd(1), slot: '11:00 AM', createdAt: daysAgo(1, 12), status: 'Approved', enquiryId: 'e5' },
    { id: 't2', ref: 'TD-0202', vehicleId: 'CL-0004', name: 'Meera Gokhale', phone: '+91 90000 00110', date: daysFromNowYmd(3), slot: '4:00 PM', createdAt: daysAgo(2, 16), status: 'Pending', enquiryId: 'e10' },
    { id: 't3', ref: 'TD-0203', vehicleId: 'CL-0001', name: 'Aarav Kulkarni', phone: '+91 90000 00101', email: 'aarav.k@example.com', date: daysFromNowYmd(2), slot: '10:00 AM', notes: 'Prefers Saturday morning.', createdAt: minutesAgo(18), status: 'Pending', enquiryId: 'e1' },
    { id: 't4', ref: 'TD-0204', vehicleId: 'CL-0003', name: 'Priya Deshpande', phone: '+91 90000 00102', date: daysFromNowYmd(4), slot: '12:00 PM', createdAt: minutesAgo(150), status: 'Pending', enquiryId: 'e2' },
    { id: 't5', ref: 'TD-0205', vehicleId: 'CL-0009', name: 'Ananya Rao', phone: '+91 90000 00106', date: daysFromNowYmd(-12), slot: '3:00 PM', createdAt: daysAgo(14, 10), status: 'Completed', enquiryId: 'e6' },
  ]

  const sellRequests: SellRequest[] = [
    { id: 's1', ref: 'SR-0301', brand: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi+ AMT', mfgYear: 2020, regYear: 2020, km: 38000, fuel: 'petrol', transmission: 'automatic', owners: '1st owner', askingPrice: 625000, accidentHistory: 'No accidents', serviceHistory: 'Full authorised service history', insuranceValid: 'Valid', registrationValid: 'Valid', loan: 'No loan', conditionNotes: 'Minor scratch on rear bumper. New tyres fitted in 2025.', photos: [], photoCount: 6, name: 'Rakesh Pawar', phone: '+91 90000 00201', email: 'rakesh.p@example.com', preferredContact: 'WhatsApp', createdAt: minutesAgo(40), status: 'New', notes: [] },
    { id: 's2', ref: 'SR-0302', brand: 'Toyota', model: 'Innova Crysta', variant: '2.4 ZX 7-seater', mfgYear: 2019, regYear: 2019, km: 92000, fuel: 'diesel', transmission: 'manual', owners: '2nd owner', askingPrice: 1850000, accidentHistory: 'Minor — disclosed', serviceHistory: 'Full authorised service history', insuranceValid: 'Valid', registrationValid: 'Valid', loan: 'Loan running', conditionNotes: 'Rear bumper repainted. Loan with a bank, about ₹2 lakh outstanding.', photos: [], photoCount: 9, name: 'Sunita Kale', phone: '+91 90000 00202', preferredContact: 'Phone call', createdAt: daysAgo(1, 9), status: 'Contacted', notes: [note('n7', daysAgo(1, 14), 'Amit (Operations)', 'Spoke to owner. Needs loan closure letter before listing.')] },
    { id: 's3', ref: 'SR-0303', brand: 'BMW', model: 'X1', variant: 'sDrive20d xLine', mfgYear: 2018, regYear: 2018, km: 61000, fuel: 'diesel', transmission: 'automatic', owners: '1st owner', askingPrice: 2250000, accidentHistory: 'No accidents', serviceHistory: 'Full authorised service history', insuranceValid: 'Valid', registrationValid: 'Valid', loan: 'No loan', photos: [], photoCount: 12, name: 'Nikhil Apte', phone: '+91 90000 00203', email: 'nikhil.apte@example.com', preferredContact: 'Email', createdAt: daysAgo(3, 11), status: 'Under Review', notes: [] },
    { id: 's4', ref: 'SR-0304', brand: 'Hyundai', model: 'Grand i10 Nios', variant: 'Sportz', mfgYear: 2021, regYear: 2021, km: 29000, fuel: 'petrol', transmission: 'manual', owners: '1st owner', askingPrice: 480000, accidentHistory: 'No accidents', serviceHistory: 'Partial records', insuranceValid: 'Expired', registrationValid: 'Valid', loan: 'No loan', photos: [], photoCount: 4, name: 'Pallavi Jadhav', phone: '+91 90000 00204', preferredContact: 'WhatsApp', createdAt: daysAgo(6, 15), status: 'Closed', notes: [note('n8', daysAgo(5, 12), 'Amit (Operations)', 'Owner’s expected price well above market. Closed for now.')] },
  ]

  const sourcingRequests: SourcingRequest[] = [
    { id: 'f1', ref: 'FC-0401', makeModel: 'Kia Seltos or Hyundai Creta', budgetMin: 1000000, budgetMax: 1400000, yearFrom: 2021, maxKm: 50000, fuel: 'Petrol', transmission: 'Automatic', requirements: 'Sunroof preferred. White or grey.', name: 'Tanvi Kulkarni', phone: '+91 90000 00301', email: 'tanvi.k@example.com', createdAt: minutesAgo(95), status: 'New', notes: [] },
    { id: 'f2', ref: 'FC-0402', makeModel: 'Toyota Fortuner', budgetMin: 2800000, budgetMax: 3500000, yearFrom: 2019, maxKm: 90000, fuel: 'Diesel', transmission: 'Any', requirements: '4x4 only. Needed before the end of the month.', name: 'Gaurav Shetty', phone: '+91 90000 00302', createdAt: daysAgo(2, 10), status: 'Searching', notes: [note('n9', daysAgo(1, 18), 'Rahul (Sales)', 'Checking with two Park & Sell owners.')] },
    { id: 'f3', ref: 'FC-0403', makeModel: 'Mercedes-Benz C-Class', budgetMax: 4000000, yearFrom: 2019, maxKm: 60000, fuel: 'Any', transmission: 'Automatic', name: 'Rhea Fernandes', phone: '+91 90000 00303', email: 'rhea.f@example.com', createdAt: daysAgo(7, 14), status: 'Match Shared', notes: [note('n10', daysAgo(4, 13), 'Pooja (Sales)', 'Shared the GLA 200 as an alternative.')] },
  ]

  const activity: Activity[] = [
    { id: 'a1', at: minutesAgo(18), kind: 'enquiry', text: 'Aarav Kulkarni requested a test drive — 2021 Hyundai Creta', link: '/admin/enquiries?open=e1' },
    { id: 'a2', at: minutesAgo(40), kind: 'sell', text: 'New sell request — 2020 Maruti Suzuki Swift', link: '/admin/sell-requests?open=s1' },
    { id: 'a3', at: minutesAgo(75), kind: 'enquiry', text: 'Callback requested by Kavya Iyer — 2021 Mercedes-Benz GLA', link: '/admin/enquiries?open=e8' },
    { id: 'a4', at: minutesAgo(95), kind: 'sourcing', text: 'Find My Car request — Kia Seltos or Hyundai Creta', link: '/admin/sourcing?open=f1' },
    { id: 'a5', at: minutesAgo(150), kind: 'enquiry', text: 'Pooja marked Priya Deshpande as Contacted' },
    { id: 'a6', at: daysAgo(1, 12), kind: 'testdrive', text: 'Test drive approved — 2021 Porsche 718 Cayman, Siddharth Mehta' },
    { id: 'a7', at: daysAgo(1, 10), kind: 'inventory', text: 'Škoda Slavia Style added to inventory' },
  ]

  return { vehicles, enquiries, testDrives, sellRequests, sourcingRequests, activity, version: 1 }
}
