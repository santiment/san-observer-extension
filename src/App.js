import React, { Component } from 'react'
//import TrendsView from './TrendsView'
import BalanceView from './BalanceView'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        { 
          //<TrendsView />
          <BalanceView />
        }
      </div>
    )
  }
}

export default App
