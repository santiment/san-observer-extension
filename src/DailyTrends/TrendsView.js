import React from 'react'
import GetTrends from './GetTrends'

const TrendsView = () => {
  return (
    <GetTrends render={
      ({data}) => (
        <div>
          {
            data && data.topWords.map((trend, index) => (
              <div key={index}>
                {data.datetime} - {trend.word} - {trend.score}
              </div>
            ))
          }
        </div>
      )
    } />
  ) 
}

export default TrendsView
