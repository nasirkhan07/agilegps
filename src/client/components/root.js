// /* Copyright (c) 2016 Grant Miner */
"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Navbar from './navbar';
import Map from './map';
import Sidebar from './sidebar';
import Organization from './organization';
import Session from './session';

import queryString from 'query-string';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentWillMount() {
    const parsed = queryString.parse(location.search);

  }

  render() {
    const { user } = this.props;

    if (!user.username) {
      return (
        <Session />
      );
    }

    return (
      <div>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="sidebar col-sm-2">
              <Sidebar />
            </div>
            <div className="col-sm-10">
              {/* <Map /> */}
            </div>            
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            {/* <Reports /> */}
            <Organization />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => bindActionCreators({
  }, dispatch),
)(Root);