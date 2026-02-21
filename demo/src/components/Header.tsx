export function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <svg
          className="header__icon"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 2L4 7v7c0 5.25 4.3 10.15 10 11.35C19.7 24.15 24 19.25 24 14V7L14 2z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M14 2L4 7v7c0 5.25 4.3 10.15 10 11.35C19.7 24.15 24 19.25 24 14V7L14 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 14l3 3 5-5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="header__wordmark">
          <span className="header__name">Bank of Finprim</span>
          <span className="header__tagline">Financial Primitives Demo</span>
        </div>
      </div>
    </header>
  )
}
