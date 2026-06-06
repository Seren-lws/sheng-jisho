import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.YUNWU_API_KEY!,
  baseURL: process.env.YUNWU_BASE_URL || "https://yunwu.ai/v1",
});

const MODEL = process.env.YUNWU_MODEL || "gpt-4o-mini";

export async function searchWord(query: string) {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `你是一个精准的日语词典。用户输入日语或中文，你判断查询方向并返回词条。
严格返回如下 JSON（不要多余字段）：
{
  "results": [
    {
      "original": "日语原文（汉字写法，没有汉字则同假名）",
      "kana": "全假名注音",
      "pitch": "声调标记，用数字标高低，如 0 表示平板型，1 表示头高型等。如不确定写 '?'",
      "pos": "词性，如 名词/动词/形容词/副词/感叹词 等",
      "meaning": "简明中文释义，一到两行",
      "tags": ["从以下枚举中选取合适的标签：N5/N4/N3/N2/N1/日常/正式/口语/俚语/网络/商务/学术"]
    }
  ]
}
如果输入模糊，最多返回 3 个最可能的结果。`,
      },
      { role: "user", content: query },
    ],
  });

  const text = res.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(text);
  return parsed.results || [];
}

export async function generateQuiz(
  word: { original: string; kana: string; meaning: string },
  type: string
) {
  const prompts: Record<string, string> = {
    ja_to_zh: `给出日语单词「${word.original}（${word.kana}）」，用户需要回答中文意思。请生成一个选择题，4个选项，只有1个正确。返回JSON：{"question":"${word.original}（${word.kana}）的意思是？","answer":"正确答案","options":["选项1","选项2","选项3","选项4"]}`,
    zh_to_ja: `给出中文含义「${word.meaning}」，用户需要回答对应的日语。请生成一个选择题，4个选项用假名，只有1个正确。返回JSON：{"question":"「${word.meaning}」用日语怎么说？","answer":"${word.kana}","options":["选项1","选项2","选项3","选项4"]}`,
    cloze: `用日语单词「${word.original}（${word.kana}）」造一个自然的例句，把该词挖空用____替代。返回JSON：{"question":"挖空例句","answer":"${word.original}","options":["选项1","选项2","选项3","选项4"]}`,
  };

  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "你是日语学习助手。严格返回指定格式的JSON，确保正确答案在options数组中。",
      },
      { role: "user", content: prompts[type] || prompts["ja_to_zh"] },
    ],
  });

  return JSON.parse(res.choices[0]?.message?.content || "{}");
}
