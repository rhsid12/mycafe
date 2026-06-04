import { useState } from 'react'
import { Header } from './components/Header'
import { AdminPage } from './pages/AdminPage'
import { OrderPage } from './pages/OrderPage'
import './App.css'

type Page = 'order' | 'admin'

function App() {
  const [page, setPage] = useState<Page>('order')
  const [inventoryVersion, setInventoryVersion] = useState(0)

  function handleNavigate(next: Page) {
    if (next === 'admin' && page !== 'admin') {
      setInventoryVersion((v) => v + 1)
    }
    setPage(next)
  }

  function handleOrderComplete() {
    setInventoryVersion((v) => v + 1)
  }

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={handleNavigate} />
      <main className="main">
        {page === 'order' ? (
          <OrderPage onOrderComplete={handleOrderComplete} />
        ) : (
          <AdminPage refreshKey={inventoryVersion} />
        )}
      </main>
    </div>
  )
}

export default App
