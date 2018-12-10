import React, { Component } from 'react'
import { ApolloConsumer, withApollo} from "react-apollo"
import moment from 'moment'
import gql from 'graphql-tag'

const fetchData = (client, hour) => {
  return new Promise((res, rej) => {
    client.query({
      query: gql`
          query trendingWords($from: DateTime!, $to: DateTime!, $hour: Int!) {
          trendingWords(
            source: ALL,
            size: 10,
            hour: $hour,
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
        `,
      variables: { 
        from: '2018-12-01T16:28:22.486Z',
        to: '2018-12-07T16:28:22.486Z',
        hour
      }
    }).then(data => res(data))
  })
}

const secretDataTeamHours = [1, 8, 14]

class GetTrends extends Component {
  state = {
    data: {
      topWords: [] 
    } 
  }

  async componentWillMount() {
    const promises = secretDataTeamHours.map(async hour => {
      return await fetchData(this.props.client, hour)
    })
    const data = await Promise.all(promises)
    const normalizedData = data.reduce((acc, val, index) => {
      const { data = [] } = val
      data.trendingWords.forEach(el => {
        acc.push({
          ...el,
          datetime: moment(el.datetime)
          .add(secretDataTeamHours[index], 'hours')
          .utc()
          .format()
        })
      })
      return acc
    }, [])
      .sort((a, b) => (moment(a.datetime).isAfter(b.datetime) ? 1 : -1))
      .reverse()[0]
    this.setState({data: normalizedData})
  }

  render() {
    const { render, ...props } = this.props
    const { data } = this.state
    return render({data}) 
  }
}

export default withApollo(GetTrends)
