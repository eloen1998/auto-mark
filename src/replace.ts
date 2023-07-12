const needReplace = ['，', '。', '；', '‘', '’']

type Replace = typeof needReplace[number]

const replaceMap: Record<Replace, string> = {
  '，': ',',
  '。': '.',
  '；': ';',
  '‘': '\'',
  '’': '\'',
}

type B = keyof typeof replaceMap

export function replace(c1: string, c2: string): string | undefined {
  if (!c1 || !c2)
    return

  if (/^[\u4E00-\u9FA5\uF900-\uFA2D]$/.test(c1))
    return

  if (needReplace.includes(c1))
    return

  if (needReplace.includes(c2))
    return replaceMap[c2 as B]
}
