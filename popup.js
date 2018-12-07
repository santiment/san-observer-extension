const client = new Apollo.lib.ApolloClient({
  networkInterface: Apollo.lib.createNetworkInterface({
    uri: 'https://api-stage.santiment.net/graphql',
    transportBatching: true,
  }),
  connectToDevTools: true,
})

const query = Apollo.gql`
  query historyPrice($from: DateTime!) {
    historyPrice(
      ticker: "TOTAL_MARKET",
      from: $from,
      interval: "5m"
    ) {
      marketcap
      volume
      datetime
    }
  }
  `

const trendingWordsQuery =  Apollo.gql`
  query trendingWords($from: DateTime!, $to: DateTime!) {
    trendingWords(
      source: ALL,
      size: 10,
      hour: 8,
      from: $from,
      to: $to
    ) {
      datetime 
      topWords {
        score
        word
      }
    }
  }

  `

const getemojibychanges = (change) => {
  if (change >= 10) {
    return "🤑"
  } else if (change >= 5 && change < 10) {
    return "😁"
  } else if (change >= 0 && change < 5) {
    return "😀"
  } else if (change < 0 && change >= -5) {
    return "🤔"
  } else if (change >= -10 && change < -5) {
    return "😰"
  } else if (change < -10 && change >= -30) {
    return "😱"
  } else return "🤯"
}

const getyesterdaydate = () => {
  const yesterday = new Date(Date.now() - 86400000)
  yesterday.setHours(0,0,0,0)
  return yesterday.toISOString()
}

client.query({ query: query, variables: {
  from: getyesterdaydate()
}}).then(result => {
  const history = result.data.historyPrice
  const today = history[history.length - 1]
  const prev = history[0]
  const cap24h = (today.marketcap - prev.marketcap) / prev.marketcap * 100
  const volume24h = (today.volume - prev.volume) / prev.volume * 100
  const el = document.querySelector('#result')
  el.innerHTML = `Total Marketcap 24h: ${getemojibychanges(cap24h)} ${cap24h.toFixed(2)}% </br>
    Volume 24h: ${getemojibychanges(volume24h)} ${volume24h.toFixed(2)}%`
}) 

const compare = (a, b) => a.score - b.score

const getLink = word => `<a href="https://app.santiment.net/trends/explore/${word}" target="_blank">${word}</a>`

client.query({ query: trendingWordsQuery, variables: {
  from: getyesterdaydate(),
  to: new Date().toISOString()
}}).then(result => {
  const history = result.data.trendingWords
  const today = history[history.length - 1]
  const topWords = today ? today.topWords : []
  const sorted =  [...topWords].sort(compare).reverse()
  const el = document.querySelector('#topWords')
  if (topWords.length > 1) {
    el.innerHTML = `<h2>Top Trending Words:</h2>
      ${sorted.map(el => getLink(el.word) + " " + parseInt(el.score)).join("</br>")}`
  } else {
    el.innerHTML = "Stage server doesn't respod with proper data" 
  }
})
