import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useApp } from './store'
import Dashboard from './pages/Dashboard'
import QuestionsPage from './pages/QuestionsPage'
import PracticePage from './pages/PracticePage'
import SimulationsPage from './pages/SimulationsPage'
import NotebooksPage from './pages/NotebooksPage'
import PlanPage from './pages/PlanPage'
import MaterialsPage from './pages/MaterialsPage'
import MaterialDetailPage from './pages/MaterialDetailPage'
import FlashcardsPage from './pages/FlashcardsPage'
import FlashcardReviewPage from './pages/FlashcardReviewPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import AccountPage from './pages/AccountPage'
import AuthPage from './pages/AuthPage'

function ProtectedLayout() {
  const { state } = useApp()
  if (!state.loggedIn) return <Navigate to="/entrar" replace />
  return <Layout />
}

export default function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<AuthPage mode="login" />} />
      <Route path="/cadastro" element={<AuthPage mode="signup" />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/painel" element={<Dashboard />} />
        <Route path="/questoes" element={<QuestionsPage />} />
        <Route path="/praticar" element={<PracticePage />} />
        <Route path="/simulados" element={<SimulationsPage />} />
        <Route path="/cadernos" element={<NotebooksPage />} />
        <Route path="/plano" element={<PlanPage />} />
        <Route path="/materiais" element={<MaterialsPage />} />
        <Route path="/materiais/:disciplineId" element={<MaterialDetailPage />} />
        <Route path="/materiais/:disciplineId/:lessonId" element={<MaterialDetailPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/flashcards/revisar/:disciplineId" element={<FlashcardReviewPage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/cursos/:courseId" element={<CourseDetailPage />} />
        <Route path="/conta" element={<AccountPage />} />
        <Route path="/" element={<Navigate to="/painel" replace />} />
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Route>
    </Routes>
  )
}
