import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import OwnerPage from './pages/OwnerPage'
import CustomerPage from './pages/CustomerPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/owner" element={<OwnerPage />} />
          <Route path="/customer" element={<CustomerPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

