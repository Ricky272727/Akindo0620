import axios from 'axios';
import openai from 'openai';

async function getDescription(address) {
  // Google Custom Search JSON APIを使ってウェブ検索を行う
  const searchResult = await axios.get(
    `https://www.googleapis.com/customsearch/v1`,
    {
      params: {
        key: process.env.REACT_APP_GOOGLE_API_KEY,
        cx: process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID,      
        q: address,
      },
    }
  );

  // 検索結果から必要な情報を抽出
  // ここでは簡易的に最初の検索結果のスニペットを使用
  const info = searchResult.data.items[0].snippet;

  // OpenAIのAPIを使って要約を作成
  const openaiApi = openai.Api({
    key: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const summaryResult = await openaiApi.Completion.create({
    engine: 'text-davinci-002',
    prompt: `I read: "${info}".\n\nSummary:`,
    max_tokens: 100,
  });

  // 要約結果を取得
  const summary = summaryResult.choices[0].text.trim();

  return summary;
}

export default getDescription;

