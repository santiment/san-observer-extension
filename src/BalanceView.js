import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Input } from '@santiment-network/ui'
import { LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts'
import moment from 'moment'

const query = gql`
  query historicalBalance($from: DateTime!, $to: DateTime!, $address: String!, $interval: String!, $slug: String) {
  historicalBalance(
    address: $address,
    interval: $interval,
    slug: $slug,
    from: $from,
    to: $to
  ) {
    datetime 
    balance
  }
}
`

class BalanceView extends React.Component {
  state = {
    address: '0x1f3df0b8390bb8e9e322972c5e75583e87608ec2',
    slug: 'santiment',
    history: ['0x1f3df0b8390bb8e9e322972c5e75583e87608ec2']
  }

  render() {
    const { address, slug } = this.state
    return (
      <div>
        <Input value={address}  name="address" onChange={this.handleChange} />
        <div style={{'textAlign': 'left', padding: 5, background: '#eee'}}>
        {this.state.history.map(address => (
          <div 
            style={{
              'cursor': 'pointer',
              fontSize: 12,
              border: '1px solid gray',
              borderRadius: 4,
              padding: 2,
              marginTop: 2
            }}
            onClick={() => this.setState({address})}>{address}</div>
        ))}
        </div>
        <Input value={slug} name="slug" onChange={this.handleChange} />
        <Query query={query} variables={{
          ...this.state,
          from: '2017-12-01T16:28:22.486Z',
          to: '2018-12-07T16:28:22.486Z',
          interval: '4w'
        }}>
        {({ loading, error, data }) => {
          if (loading) return null
          if (error) return `Error!: ${error}`
          return (
            <LineChart
              width={400}
              height={400}
              data={data.historicalBalance}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <Tooltip formatter={(value, name, props) => {
                return moment(props.payload.datetime).format('YYYY-MM-DD') + ": " + new Intl.NumberFormat().format(value)
              }} />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="balance" stroke="#387908" yAxisId={1} />
          </LineChart>
          )
        }}
      </Query>
    </div>
    )
  }

  handleChange = event => {
    if (event.target.name === 'address' && event.target.value.length === 42) {
      const unique = new Set([...this.state.history, event.target.value])
      this.setState({history: Array.from(unique)})
    }
    this.setState({[event.target.name]: event.target.value})
  }
}

export default BalanceView
