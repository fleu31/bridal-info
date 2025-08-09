// ---------- Block Kit（mailto は本文リンクで出す版） ----------
function buildSlackBlocks(input: {
  mention: string, name: string, email: string, phone: string, category: string,
  message: string, path: string, ref: string, studioDeepLink: string
}) {
  const header = '新しいお問い合わせ'
  const mentionLine = input.mention ? `${input.mention} ` : ''
  const fallbackText = `${mentionLine}${header} - ${input.name} (${input.email})`

  const fields: string[] = []
  if (input.name) fields.push(`*名前:*\n${input.name}`)
  if (input.email) fields.push(`*メール:*\n${input.email}`)
  if (input.phone) fields.push(`*電話:*\n${input.phone}`)
  if (input.category) fields.push(`*カテゴリ:*\n${input.category}`)
  if (input.path) fields.push(`*from:*\n${input.path}`)
  if (input.ref) fields.push(`*ref:*\n${input.ref}`)

  // 件名・本文プリセット（mailto は mrkdwn のリンクで表示）
  const subject = encodeURIComponent(`ブライダル美容のお問い合わせ（${input.name || 'お客様'}様）`)
  const body = encodeURIComponent(
`【${input.name || ''} 様】

お問い合わせありがとうございます。
こちらはブライダル美容医療の窓口です。以下の内容で承りました。
----------------
カテゴリ: ${input.category || '-'}
本文:
${input.message || '-'}
----------------

このメールにご返信ください。`
  )
  const mailto = input.email
    ? `mailto:${input.email}?subject=${subject}&body=${body}`
    : ''

  const blocks: any[] = [
    { type: 'header', text: { type: 'plain_text', text: header } },
    ...(input.mention ? [{ type: 'section', text: { type:'mrkdwn', text: input.mention } }] : []),
    { type: 'section', fields: fields.map(f => ({ type:'mrkdwn', text:f })) },
    { type: 'section', text: { type: 'mrkdwn', text: `*本文:*\n${input.message || '-'}` } },
    // ★ メール返信は mrkdwn の mailto リンクで出す（ボタンにしない）
    ...(mailto ? [{
      type: 'section',
      text: { type: 'mrkdwn', text: `✉️ *メール返信*: <${mailto}|メールを作成>` }
    }] : []),
  ]

  // Studio だけはボタン（http/https）でOK
  const actions:any[] = []
  if (input.studioDeepLink) {
    actions.push({ type:'button', text:{ type:'plain_text', text:'Studioで開く' }, url: input.studioDeepLink })
  }
  if (actions.length) blocks.push({ type:'actions', elements: actions })

  return { fallbackText, blocks }
}
