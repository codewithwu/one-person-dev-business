export interface Chapter {
  slug: string
  filename: string
  displayTitle: string
  part: number
  partName: string
}

export const parts = [
  { id: 1, name: '认知篇', subtitle: 'Mindset' },
  { id: 2, name: '路径篇', subtitle: 'Paths' },
  { id: 3, name: '实战篇', subtitle: 'Practice' },
  { id: 4, name: '进阶篇', subtitle: 'Advanced' },
]

export const chapters: Chapter[] = [
  // Part 1: 认知篇
  { slug: '00-foreword', filename: '第0章-前言.md', displayTitle: '前言', part: 1, partName: '认知篇' },
  { slug: '01-one-person-army', filename: '第4章-一人就是一支队伍.md', displayTitle: '第一章 一个人就是一支队伍', part: 1, partName: '认知篇' },
  { slug: '02-time-is-scarce', filename: '第2章-时间是最稀缺资源.md', displayTitle: '第二章 你最缺的不是技术，是时间', part: 1, partName: '认知篇' },
  { slug: '03-from-time-to-assets', filename: '第1章-从卖时间到建资产.md', displayTitle: '第三章 从卖时间到建资产', part: 1, partName: '认知篇' },
  { slug: '04-ai-arsenal', filename: '第3章-AI时代的武器库.md', displayTitle: '第四章 AI 时代的武器库', part: 1, partName: '认知篇' },

  // Part 2: 路径篇
  { slug: '05-build-products', filename: '第5章-做自己的产品.md', displayTitle: '第五章 路径一：做自己的产品', part: 2, partName: '路径篇' },
  { slug: '06-freelancing', filename: '第6章-接单挣钱.md', displayTitle: '第六章 路径二：接单挣钱', part: 2, partName: '路径篇' },
  { slug: '07-knowledge-income', filename: '第7章-用知识挣钱.md', displayTitle: '第七章 路径三：用知识挣钱', part: 2, partName: '路径篇' },
  { slug: '08-open-source-moat', filename: '第8章-用开源建护城河.md', displayTitle: '第八章 路径四：用开源建护城河', part: 2, partName: '路径篇' },

  // Part 3: 实战篇
  { slug: '09-zero-to-one', filename: '第9章-从零到一的流程.md', displayTitle: '第九章 从零到一的完整流程', part: 3, partName: '实战篇' },
  { slug: '10-pricing-art', filename: '第10章-收钱的艺术.md', displayTitle: '第十章 收钱的艺术', part: 3, partName: '实战篇' },
  { slug: '11-tax-legal', filename: '第11章-税务与法务.md', displayTitle: '第十一章 税务与法务', part: 3, partName: '实战篇' },
  { slug: '12-engineer-to-business', filename: '第15章-从工程师到生意人.md', displayTitle: '第十二章 从工程师到生意人', part: 3, partName: '实战篇' },

  // Part 4: 进阶篇
  { slug: '13-how-you-might-fail', filename: '第13章-你可能会怎么死.md', displayTitle: '第十三章 你可能会怎么死', part: 4, partName: '进阶篇' },
  { slug: '14-ai-wont-fire-you', filename: '第14章-AI改变工作方式.md', displayTitle: '第十四章 AI 不会让你失业', part: 4, partName: '进阶篇' },
  { slug: '15-side-hustle-to-company', filename: '第12章-从副业到一人公司.md', displayTitle: '第十五章 从副业到一人公司', part: 4, partName: '进阶篇' },
  { slug: '16-afterword', filename: '第16章-后记.md', displayTitle: '后记', part: 4, partName: '进阶篇' },
]
