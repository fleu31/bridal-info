import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'

export const metadata = { title: 'お問い合わせ' }

export default function ContactPage(){
  return (
    <div>
      <Header/>
      <main className="container py-10 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">お問い合わせ</h1>
        <p className="text-sm text-neutral-600">一般情報の質問・サイト掲載に関する連絡はこちらから。</p>
        <div className="card">
          <ContactForm/>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
