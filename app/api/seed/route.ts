import {NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

export const dynamic = 'force-dynamic'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-10-01'
const token = process.env.SANITY_API_TOKEN
const seedSecret = process.env.SEED_SECRET

function pt(text: string) {
  return [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text }] }]
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const key = url.searchParams.get('key')
    if (!seedSecret || key !== seedSecret) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!projectId || !token) {
      return new NextResponse('Missing env', { status: 500 })
    }

    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

    const docs = [
      // サイト設定
      {
        _id: 'siteSettings',
        _type: 'site',
        siteName: 'ブライダル皮膚ガイド',
        navItems: [
          { label: '考え方', href: '/#about' },
          { label: '逆算', href: '/#timeline' },
          { label: 'チェッカー', href: '/tools/checker' },
          { label: '72時間前', href: '/tools/checklist-72h' },
          { label: 'ディレクトリ', href: '/directory' },
          { label: '記事', href: '/articles' },
          { label: '編集ポリシー', href: '/policy' },
          { label: 'FAQ', href: '/faq' }
        ],
        footerLinks: [
          { label: '編集ポリシー', href: '/policy' },
          { label: 'FAQ', href: '/faq' }
        ],
        footerNote: '本サイトは一般情報の提供を目的とします。具体的な判断は医療機関で行われます。'
      },

      // ホーム設定
      {
        _id: 'homeSettings',
        _type: 'home',
        heroTitle: '結婚式までの美容医療情報ガイド',
        heroLead:
          '本サイトは医療機関ではありません。掲載内容は一般情報であり、個別の診断・治療の提案ではありません。最終的な適応判断と同意取得は医療機関で行われます。直前は仕上げ（導入・鎮静）を基本に、安全性を優先します。',
        bullets: [
          '挙式／前撮りから逆算した「やる／やらない」の目安',
          '直前は仕上げ中心。新規の強い施術は避ける方針',
          '悩み別（赤み・毛穴・ニキビ・背中）の読み物',
          '編集独立／推薦・順位付けなし'
        ],
        heroButtons: [
          { label: '逆算チェッカー', url: '/tools/checker' },
          { label: 'ディレクトリ', url: '/directory' },
          { label: '記事一覧', url: '/articles' },
          { label: '72時間前チェック', url: '/tools/checklist-72h' }
        ],
        timeline: [
          { title: 'T−6〜3か月', points: ['トーン／質感の土台づくり', '強めの施術は早期に試射', '毎回仕上げで安定化'] },
          { title: 'T−8〜4週', points: ['出力は控えめに調整', '新規の強い施術は避ける', '前撮りが近い場合は前撮り優先'] },
          { title: 'T−2〜1週', points: ['仕上げ（導入・鎮静）のみ', '刺激・摩擦を避ける', 'メイクとの相性を確認'] },
          { title: 'T−1〜3日', points: ['施術は行わない', '睡眠・塩分・飲酒を整える', '衣装・移動での擦れ対策'] }
        ],
        concerns: [
          { tag: '赤み・くすみ', title: 'トーンを整える', points: ['早期に試射→反応を確認', '直前は仕上げのみ', '生活：紫外線・睡眠・塩分'] },
          { tag: '毛穴・質感', title: '凹凸の扱い方', points: ['ピーク対策はT−4週以前に', '強い出力は早期に実施・評価', 'ベースメイクとの相性を確認'] },
          { tag: 'ニキビ・跡', title: '炎症があるときの判断', points: ['無理はしない（悪化リスクを避ける）', '刺激の強い施術は見送り', '医療機関の判断を優先'] },
          { tag: '背中・二の腕', title: 'ドレス映えのために', points: ['露出部位の摩擦対策', '日焼け・乾燥を避ける', '仕上げケアで質感を整える'] }
        ],
        disclaimer:
          '本サイトは一般情報の提供を目的とします。具体的な出力・回数・リスク説明は医療機関で行われます。当サイト経由で受診が成立した場合、医療機関から紹介料を受け取ることがあります（編集内容の独立は保持します）。'
      },

      // 固定ページ：policy
      {
        _id: 'page-policy',
        _type: 'page',
        title: '編集ポリシー／利益相反の開示',
        slug: { _type: 'slug', current: 'policy' },
        body: [
          ...pt('本サイトは一般情報の提供を目的とします。診断・治療の提案は行いません。'),
          ...pt('推薦・順位付けは行いません。直前対応・試射運用・撮影規格などの観点を提示します。'),
          ...pt('当サイト経由の受診が成立した場合、医療機関から紹介料を受領することがあります。編集内容の独立性は保持します。')
        ]
      },

      // 固定ページ：faq
      {
        _id: 'page-faq',
        _type: 'page',
        title: 'FAQ（一般情報）',
        slug: { _type: 'slug', current: 'faq' },
        body: [
          ...pt('当サイトは紹介・一般情報の提供のみ。診療・適応判断・同意取得は医療機関で行われます。'),
          ...pt('直前（2週間以内）は仕上げ中心。新規の侵襲的施術は推奨しません。')
        ]
      },

      // 逆算チェッカー注記
      {
        _id: 'toolChecker-default',
        _type: 'toolChecker',
        disclaimer: '本ツールは一般情報の提供を目的とします。具体的な適応・出力の判断は医療機関で行われます。'
      },

      // 72時間前チェックリスト
      {
        _id: 'toolChecklist72h-default',
        _type: 'toolChecklist72h',
        intro: '直前は仕上げ（導入・鎮静）に徹し、新規の侵襲的施術は避けます。体調不良や強い反応がある場合は医療機関に相談してください。',
        items: [
          '睡眠を優先（6–8時間）',
          '塩分/アルコール控えめ',
          '仕上げケア（導入・鎮静・保湿）のみ',
          '直射日光・長時間の屋外を避ける',
          '移動や衣装での擦れ対策（背中・二の腕）',
          '当日メイクの相性確認（ベース/下地）'
        ]
      },

      // 記事サンプル（1本）
      {
        _id: 'article-sample-1',
        _type: 'article',
        title: 'T−8〜4週：仕上げに向けて負荷を下げる',
        slug: { _type: 'slug', current: 't-8-4weeks' },
        category: '逆算',
        updatedAt: new Date().toISOString(),
        body: [
          ...pt('本記事は一般情報であり、個別の診断・治療の提案ではありません。適応判断・同意取得は医療機関で行われます。'),
          ...pt('要点：出力は控えめに／新規の強い施術は避ける／前撮りが近い場合は前撮り優先。')
        ]
      }
    ]

    const tx = client.transaction()
    docs.forEach((d) => tx.createOrReplace(d))
    await tx.commit()

    return NextResponse.json({ ok: true, created: docs.length })
  } catch (e: any) {
    return new NextResponse(e?.message || 'seed error', { status: 500 })
  }
}
