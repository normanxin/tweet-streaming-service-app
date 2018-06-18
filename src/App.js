import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Filter from './components/Filter';
import streamingDataUtil from './utils/streamingDataUtil';
import workerPoolUtil from './utils/workerPoolUtil';

class App extends Component {
  constructor(props) {
    super(props);
    this.rulesVersion = 0;
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const self = this;

    streamingDataUtil.start();
    workerPoolUtil.addEventListener('message', event => {
      const {version, data} = event.data;

      if (version !== self.rulesVersion) {
        return;
      }

      self.setState({data});
    });
  }

  componentWillUnmount() {
    streamingDataUtil.close();
    workerPoolUtil.unregister();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Tweet Streaming Service</h1>
        </header>
        <p className="App-intro">
          Add conditions and submit to filter Tweets.
        </p>
        <Filter onSubmit={this.handleFilterSubmit} />
        <ul>
          {this.state.data.map((tweet, i) =>
            <li key={i}>{JSON.stringify(tweet)}</li>)
          }
        </ul>
      </div>
    );
  }

  handleFilterSubmit = conditions => {
    workerPoolUtil.postMessageToAll({
      type: 'rules',
      data: {
        version: ++this.rulesVersion,
        conditions,
      }
    });
  }
}

export default App;
