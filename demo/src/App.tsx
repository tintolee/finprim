import { Header } from './components/Header.tsx'
import { Footer } from './components/Footer.tsx'
import { IBANSection } from './components/IBANSection.tsx'
import { UKPaymentSection } from './components/UKPaymentSection.tsx'
import { CreditCardSection } from './components/CreditCardSection.tsx'
import { CurrencySection } from './components/CurrencySection.tsx'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="container">
          <IBANSection />
          <UKPaymentSection />
          <CreditCardSection />
          <CurrencySection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
