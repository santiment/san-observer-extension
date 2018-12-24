import React, { Component } from 'react'
import BalanceView from './HistoricalBalance/BalanceView'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BalanceView />
      </div>
    )
  }
}

export default App
