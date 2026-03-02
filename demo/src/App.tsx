import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { IBANSection } from './components/IBANSection'
import { UKPaymentSection } from './components/UKPaymentSection'
import { CreditCardSection } from './components/CreditCardSection'
import { CurrencySection } from './components/CurrencySection'

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
