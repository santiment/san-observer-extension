import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Select } from '@santiment-network/ui'
import '@santiment-network/ui/styles.css'

const allAssetsGQL = gql`
  {
    allErc20Projects {
      slug
    }
  }
`

class AssetsField extends Component {
  state = {
    selected: this.props.defaultSelected
  }

  static propTypes = {
    defaultSelected: PropTypes.array,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    defaultSelected: []
  }

  handleOnChange = selected => {
    if (selected.length <= 5) {
      this.setState({ selected }, () => {
        this.props.onChange(selected)
      })
    }
  }

  render () {
    return (
      <Select
        multi
        placeholder='For example, Ethereum...'
        options={this.props.assets}
        isLoading={this.props.isLoading}
        onChange={this.handleOnChange}
        value={this.state.selected}
        className='asset-select'
        valueKey='value'
      />
    )
  }
}

const getERC20Assets = assets => {
  return (assets.allErc20Projects || []).map((asset, index) => {
    return { value: asset.slug, label: asset.slug }
  })
}

const mapDataToProps = ({ allErc20Projects }) => ({
  assets: [...getERC20Assets(allErc20Projects), { value: 'ethereum', label: 'ethereum'}],
  isLoading: allErc20Projects.isLoading
})

const enhance = graphql(allAssetsGQL, {
  name: 'allErc20Projects',
  props: mapDataToProps,
  options: () => {
    return {
      errorPolicy: 'all'
    }
  }
})

export default enhance(AssetsField)
