import { useState } from 'react'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { OrderPage } from './pages/OrderPage'
import './App.css'

type Page = 'order' | 'admin'

function App() {
  const [page, setPage] = useState<Page>('order')

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="main">
        {page === 'order' ? <OrderPage /> : <AdminPage />}
      </main>
    </div>
  )
}

export default App
