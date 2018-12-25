import { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import isEqual from 'lodash.isequal'
import { withApollo } from 'react-apollo'
import moment from 'moment'

const historicalBalanceGQL = gql`
  query historicalBalance(
    $from: DateTime!,
    $to: DateTime!,
    $address: String!,
    $interval: String!,
    $slug: String) {
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

class AssetsField extends Component {
  state = {}

  static propTypes = {
    assets: PropTypes.array.isRequired,
    wallet: PropTypes.string.isRequired,
    render: PropTypes.func
  }

  componentDidMount() {
    this.fetchHistoricalBalance()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.assets, this.props.assets) 
      || prevProps.wallet !== this.props.wallet) {

      this.cleanupHistory().then(() => {
        this.fetchHistoricalBalance()
      })
    }
  }

  cleanupHistory() {
    const slugs = this.props.assets
    return new Promise(resolve => {
      this.setState(prevState => Object.keys(prevState).reduce((acc, val) => {
        if (!slugs.includes(val)) {
          acc[val] = undefined
        }
        return acc
      }, {...prevState}), resolve())
    })
  }

  fetchHistoricalBalance() {
    this.props.assets.forEach(slug => {
      this.setState({
        [slug]: {
          loading: true,
          items: []
        }
      })

      this.props.client.query({
        query: historicalBalanceGQL,
        skip: ({ wallet }) => {
          return !wallet
        },
        variables: {
          slug,
          address: this.props.wallet,
          interval: '4w',
          to: moment().toISOString(),
          from: '2017-12-01T16:28:22.486Z'
        }
      }).then(({data, loading}) => {
        this.setState({
          [slug]: {
            loading,
            items: data.historicalBalance
          }
        })
      }).catch(error => {
        console.log(error) 
      })
    })
  }

  render () {
    return this.props.render(this.state)
  }
}

export default withApollo(AssetsField)
