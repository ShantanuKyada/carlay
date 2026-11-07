import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { DemoStoreProvider } from './store/DemoStore'
import { ToastProvider } from './components/ui/Toast'
import { SiteLayout } from './components/site/SiteLayout'
import { AdminLayout } from './components/admin/AdminLayout'
import Home from './pages/site/Home'
import BrowseCars from './pages/site/BrowseCars'
import VehicleDetail from './pages/site/VehicleDetail'
import SellCar from './pages/site/SellCar'
import TestDrive from './pages/site/TestDrive'
import FindMyCar from './pages/site/FindMyCar'
import About from './pages/site/About'
import Contact from './pages/site/Contact'
import NotFound from './pages/site/NotFound'

const Overview = lazy(() => import('./pages/admin/Overview'))
const Inventory = lazy(() => import('./pages/admin/Inventory'))
const Enquiries = lazy(() => import('./pages/admin/Enquiries'))
const TestDrives = lazy(() => import('./pages/admin/TestDrives'))
const SellRequests = lazy(() => import('./pages/admin/SellRequests'))
const Sourcing = lazy(() => import('./pages/admin/Sourcing'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function TitleSync() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = pathname.startsWith('/admin') ? 'Carlay · Team dashboard (Demo)' : 'Carlay — Pre-owned cars, Pune'
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoStoreProvider>
        <ToastProvider>
          <ScrollToTop />
          <TitleSync />
          <Suspense fallback={<div className="min-h-dvh bg-paper" />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<Home />} />
                <Route path="cars" element={<BrowseCars />} />
                <Route path="cars/:slug" element={<VehicleDetail />} />
                <Route path="sell" element={<SellCar />} />
                <Route path="test-drive" element={<TestDrive />} />
                <Route path="find-my-car" element={<FindMyCar />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Overview />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="test-drives" element={<TestDrives />} />
                <Route path="sell-requests" element={<SellRequests />} />
                <Route path="sourcing" element={<Sourcing />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </DemoStoreProvider>
    </BrowserRouter>
  )
}
