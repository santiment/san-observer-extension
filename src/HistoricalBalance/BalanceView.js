import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Input, Button, SearchWithSuggestions, Select } from '@santiment-network/ui'
import '@santiment-network/ui/styles.css'
import { LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts'
import moment from 'moment'
import styles from './BalanceView.module.css'

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

// Dummy array of test values.
const options = Array.from(new Array(1000), (_, index) => ({
  label: `Item ${index}`,
  value: index
}))

class BalanceView extends React.Component {
  state = {
    address: '0x1f3df0b8390bb8e9e322972c5e75583e87608ec2',
    slug: 'santiment',
    history: ['0x1f3df0b8390bb8e9e322972c5e75583e87608ec2'],
    isVisibleHistory: false
  }

  render() {
    const { address, slug, isVisibleHistory } = this.state
    return (
      <div className={styles.BalanceExtension}>
        <div className={styles.InputWrapper}>
          <label htmlFor="address">Wallet address</label>
          <div className={styles.InputWithAction}>
            <Input 
              value={address}
              id="address"
              name="address"
              placeholder="Paste the address"
              onChange={this.handleChange} />
            <Button onClick={() => 
                this.setState({isVisibleHistory: !isVisibleHistory})}>
                History
              </Button>
            </div>
            {isVisibleHistory && 
                <div className={styles.historyDropdown}>
                  {this.state.history.map(address => (
                    <div className={styles.addressLink} onClick={() => {
                      this.setState({address, isVisibleHistory: false})
                    }}>{address}</div>
                  ))}
                </div>
            }
          </div>
          <div className={styles.InputWrapper}>
            <label htmlFor="slug">Asset</label>
            <SearchWithSuggestions
              data={[
                'Bibox Token',
                'Bigbom',
                'Binance Coin',
                'BioCoin',
                'BitBay',
                'bitcoin'
              ]}
              suggestionContent={(suggestion, index) => 
                <div key={index} onClick={() => console.log('clcikk')}>
                  {suggestion}
                </div>
              }
              predicate={searchTerm => item =>
                  item.toUpperCase().includes(searchTerm.toUpperCase())}
                  maxSuggestions={5}
                />
                <Input 
                  value={slug}
                  id="slug"
                  name="slug"
                  placeholder="For example, Ethereum"
                  onChange={this.handleChange} />
                  <Select options={options} />
              </div>
              <Query query={query} variables={{
                ...this.state,
                from: '2017-12-01T16:28:22.486Z',
                to: '2018-12-07T16:28:22.486Z',
                interval: '4w'
              }}>
              {({ loading, error, data }) => {
                if (loading) return "Loading..."
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
