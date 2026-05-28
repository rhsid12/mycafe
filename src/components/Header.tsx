type Page = 'order' | 'admin'

type HeaderProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="brand">COZY</h1>
      <nav className="nav" aria-label="메인 메뉴">
        <button
          type="button"
          className={`nav-link ${currentPage === 'order' ? 'nav-link--active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button
          type="button"
          className={`nav-link ${currentPage === 'admin' ? 'nav-link--active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}
