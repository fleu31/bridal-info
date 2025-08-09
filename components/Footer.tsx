export default function Footer(){
  return (<footer className="border-t">
    <div className="container py-10 text-sm text-neutral-600 grid md:grid-cols-3 gap-6">
      <div><div className="font-semibold">BRAND（仮）</div><p className="mt-2">体験談掲載なし・断定表現なし。</p></div>
      <div className="space-y-1">
        <a className="block" href="/policy">編集ポリシー</a>
        <a className="block" href="/faq">FAQ</a>
      </div>
      <div className="text-xs"><p>© {new Date().getFullYear()} BRAND（仮）</p><p className="mt-2">当サイト経由で受診が成立した場合、医療機関から紹介料を受け取ることがあります。</p></div>
    </div>
  </footer>)
}
