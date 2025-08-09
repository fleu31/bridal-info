import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = { title:'Bridal Info', description:'結婚式までの美容医療 情報提供サイト（スターター）' }
export default function RootLayout({children}:{children:React.ReactNode}){ return (<html lang="ja"><body>{children}</body></html>) }
