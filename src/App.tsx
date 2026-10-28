import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ModulePage } from './pages/ModulePage'
import { ConceptPage } from './pages/ConceptPage'
import { ScrollToTop } from './components/ScrollToTop'

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn/:moduleId" element={<ModulePage />} />
          <Route path="/learn/:moduleId/:conceptId" element={<ConceptPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
