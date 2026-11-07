import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { buildSeed, type DemoState } from '../data/seed'
import { siteConfig } from '../config'
import { uid, newRef } from '../lib/validation'
import type {
  Activity,
  Enquiry,
  Note,
  SellRequest,
  SourcingRequest,
  TestDrive,
  Vehicle,
} from '../types'
import { vehicleTitle } from '../lib/format'

type NoteCollection = 'enquiries' | 'sellRequests' | 'sourcingRequests'

interface Store {
  state: DemoState
  vehicleById: (id?: string) => Vehicle | undefined
  vehicleBySlug: (slug?: string) => Vehicle | undefined
  addEnquiry: (e: Omit<Enquiry, 'id' | 'ref' | 'receivedAt' | 'notes' | 'status'> & Partial<Pick<Enquiry, 'status'>>) => Enquiry
  updateEnquiry: (id: string, patch: Partial<Enquiry>, activityText?: string) => void
  addTestDrive: (t: Omit<TestDrive, 'id' | 'ref' | 'createdAt' | 'status' | 'enquiryId'>) => TestDrive
  updateTestDrive: (id: string, patch: Partial<TestDrive>) => void
  addSellRequest: (s: Omit<SellRequest, 'id' | 'ref' | 'createdAt' | 'status' | 'notes'>) => SellRequest
  updateSellRequest: (id: string, patch: Partial<SellRequest>) => void
  addSourcingRequest: (s: Omit<SourcingRequest, 'id' | 'ref' | 'createdAt' | 'status' | 'notes'>) => SourcingRequest
  updateSourcingRequest: (id: string, patch: Partial<SourcingRequest>) => void
  addNote: (collection: NoteCollection, id: string, text: string, author?: string) => void
  saveVehicle: (v: Vehicle, isNew: boolean) => void
  setVehicleStatus: (id: string, status: Vehicle['status']) => void
  resetDemo: () => void
}

const Ctx = createContext<Store | null>(null)

function load(): DemoState {
  try {
    const raw = localStorage.getItem(siteConfig.storageKey)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      if (parsed && parsed.version === 1 && Array.isArray(parsed.vehicles)) return parsed
    }
  } catch {
    /* ignore — fall back to seed */
  }
  return buildSeed()
}

function persist(state: DemoState) {
  try {
    localStorage.setItem(siteConfig.storageKey, JSON.stringify(state))
  } catch {
    // Quota exceeded (usually photo previews). Retry without seller photo previews.
    try {
      const slim = { ...state, sellRequests: state.sellRequests.map((s) => ({ ...s, photos: [] })) }
      localStorage.setItem(siteConfig.storageKey, JSON.stringify(slim))
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(load)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    persist(state)
  }, [state])

  const act = (text: string, kind: Activity['kind'], link?: string): Activity => ({
    id: uid(),
    at: new Date().toISOString(),
    kind,
    text,
    link,
  })

  const vehicleById = useCallback((id?: string) => state.vehicles.find((v) => v.id === id), [state.vehicles])
  const vehicleBySlug = useCallback((slug?: string) => state.vehicles.find((v) => v.slug === slug), [state.vehicles])

  const store = useMemo<Store>(() => {
    const titleFor = (id?: string) => {
      const v = state.vehicles.find((x) => x.id === id)
      return v ? vehicleTitle(v) : 'No specific vehicle'
    }

    return {
      state,
      vehicleById,
      vehicleBySlug,

      addEnquiry: (e) => {
        const enquiry: Enquiry = {
          ...e,
          id: uid(),
          ref: newRef('EN'),
          receivedAt: new Date().toISOString(),
          status: e.status ?? 'New',
          notes: [],
          isSimulated: true,
        }
        setState((s) => ({
          ...s,
          enquiries: [enquiry, ...s.enquiries],
          activity: [act(`${enquiry.name} sent a ${enquiry.type.toLowerCase()} — ${titleFor(enquiry.vehicleId)}`, 'enquiry', `/admin/enquiries?open=${enquiry.id}`), ...s.activity],
        }))
        return enquiry
      },

      updateEnquiry: (id, patch, activityText) =>
        setState((s) => ({
          ...s,
          enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          activity: activityText ? [act(activityText, 'enquiry', `/admin/enquiries?open=${id}`), ...s.activity] : s.activity,
        })),

      addTestDrive: (t) => {
        const enquiryId = uid()
        const td: TestDrive = { ...t, id: uid(), ref: newRef('TD'), createdAt: new Date().toISOString(), status: 'Pending', enquiryId, isSimulated: true }
        const enquiry: Enquiry = {
          id: enquiryId,
          ref: newRef('EN'),
          name: t.name,
          phone: t.phone,
          email: t.email,
          vehicleId: t.vehicleId,
          type: 'Test drive',
          source: 'Website',
          message: `Test drive requested for ${t.date} at ${t.slot}.${t.notes ? ' ' + t.notes : ''}`,
          receivedAt: td.createdAt,
          status: 'New',
          notes: [],
          followUp: t.date,
          isSimulated: true,
        }
        setState((s) => ({
          ...s,
          testDrives: [td, ...s.testDrives],
          enquiries: [enquiry, ...s.enquiries],
          activity: [act(`${t.name} requested a test drive — ${titleFor(t.vehicleId)}`, 'testdrive', `/admin/test-drives?open=${td.id}`), ...s.activity],
        }))
        return td
      },

      updateTestDrive: (id, patch) =>
        setState((s) => {
          const td = s.testDrives.find((x) => x.id === id)
          let enquiries = s.enquiries
          // Keep the linked CRM enquiry in step with an approved test drive.
          if (td?.enquiryId && patch.status === 'Approved') {
            enquiries = enquiries.map((e) =>
              e.id === td.enquiryId && (e.status === 'New' || e.status === 'Contacted' || e.status === 'Interested')
                ? { ...e, status: 'Test Drive Scheduled' }
                : e,
            )
          }
          return {
            ...s,
            enquiries,
            testDrives: s.testDrives.map((x) => (x.id === id ? { ...x, ...patch } : x)),
            activity:
              patch.status && td
                ? [act(`Test drive ${patch.status.toLowerCase()} — ${titleFor(td.vehicleId)}, ${td.name}`, 'testdrive', `/admin/test-drives?open=${id}`), ...s.activity]
                : s.activity,
          }
        }),

      addSellRequest: (r) => {
        const req: SellRequest = { ...r, id: uid(), ref: newRef('SR'), createdAt: new Date().toISOString(), status: 'New', notes: [], isSimulated: true }
        setState((s) => ({
          ...s,
          sellRequests: [req, ...s.sellRequests],
          activity: [act(`New sell request — ${req.mfgYear} ${req.brand} ${req.model}`, 'sell', `/admin/sell-requests?open=${req.id}`), ...s.activity],
        }))
        return req
      },

      updateSellRequest: (id, patch) =>
        setState((s) => {
          const r = s.sellRequests.find((x) => x.id === id)
          return {
            ...s,
            sellRequests: s.sellRequests.map((x) => (x.id === id ? { ...x, ...patch } : x)),
            activity: patch.status && r ? [act(`Sell request ${r.ref} marked ${patch.status}`, 'sell', `/admin/sell-requests?open=${id}`), ...s.activity] : s.activity,
          }
        }),

      addSourcingRequest: (r) => {
        const req: SourcingRequest = { ...r, id: uid(), ref: newRef('FC'), createdAt: new Date().toISOString(), status: 'New', notes: [], isSimulated: true }
        setState((s) => ({
          ...s,
          sourcingRequests: [req, ...s.sourcingRequests],
          activity: [act(`Find My Car request — ${req.makeModel}`, 'sourcing', `/admin/sourcing?open=${req.id}`), ...s.activity],
        }))
        return req
      },

      updateSourcingRequest: (id, patch) =>
        setState((s) => {
          const r = s.sourcingRequests.find((x) => x.id === id)
          return {
            ...s,
            sourcingRequests: s.sourcingRequests.map((x) => (x.id === id ? { ...x, ...patch } : x)),
            activity: patch.status && r ? [act(`Sourcing request ${r.ref} marked ${patch.status}`, 'sourcing', `/admin/sourcing?open=${id}`), ...s.activity] : s.activity,
          }
        }),

      addNote: (collection, id, text, author = 'You (Demo)') => {
        const n: Note = { id: uid(), at: new Date().toISOString(), author, text }
        setState((s) => ({
          ...s,
          [collection]: (s[collection] as Array<{ id: string; notes: Note[] }>).map((x) => (x.id === id ? { ...x, notes: [n, ...x.notes] } : x)),
        }))
      },

      saveVehicle: (v, isNew) =>
        setState((s) => ({
          ...s,
          vehicles: isNew ? [v, ...s.vehicles] : s.vehicles.map((x) => (x.id === v.id ? v : x)),
          activity: [act(`${isNew ? 'Added' : 'Updated'} ${vehicleTitle(v)} ${v.variant}`, 'inventory', `/cars/${v.slug}`), ...s.activity],
        })),

      setVehicleStatus: (id, status) =>
        setState((s) => {
          const v = s.vehicles.find((x) => x.id === id)
          return {
            ...s,
            vehicles: s.vehicles.map((x) => (x.id === id ? { ...x, status } : x)),
            activity: v ? [act(`${vehicleTitle(v)} marked ${status}`, 'inventory', `/cars/${v.slug}`), ...s.activity] : s.activity,
          }
        }),

      resetDemo: () => {
        try {
          localStorage.removeItem(siteConfig.storageKey)
        } catch {
          /* ignore */
        }
        setState(buildSeed())
      },
    }
  }, [state, vehicleById, vehicleBySlug])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useDemo must be used inside DemoStoreProvider')
  return s
}
