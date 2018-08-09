import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { QuickSummary } from 'components';
import classNames from 'classnames/bind';
import styles from './navbar.css';

const cx = classNames.bind(styles);
const RPORT_TITLE = 'Container 2.0 - Test Report';

@inject('reportStore') @observer

class Navbar extends React.Component {
  static propTypes = {
    stats: PropTypes.object,
    reportStore: PropTypes.object
  };
  render() {
    const { stats, reportStore } = this.props;
    const { passPercent, pendingPercent } = stats;
    const { containerStatus } = reportStore;
    const version = containerStatus['da-testing-framework'] ? containerStatus['da-testing-framework'].version : '';

    const failPercent = 100 - passPercent;
    const allPending = pendingPercent === 100;
    const showPctBar = passPercent !== null && pendingPercent !== null;

    const pctBar = (prop, cname, title) => (
      <span
        className={ cx('pct-bar-segment', cname) }
        style={ { width: `${prop}%` } }
        title={ `${prop.toFixed(1)}% ${title}` } />
    );

    return (
      <div className={ cx('component', 'z-depth-1') } role='navigation'>
        <div className={ cx('report-info-cnt') }>
          <div className={ cx('netflix', 'logo') } />
          <div className={ cx('monet', 'logo') } />
          <h1 className={ cx('report-title') } title={ RPORT_TITLE }>
            { RPORT_TITLE }
            <sub>v{version}</sub>
          </h1>
        </div>
        <div className={ cx('stats') }>
          <QuickSummary stats={ stats } containerStatus={ containerStatus } />
        </div>
        { showPctBar &&
          <div className={ cx('pct-bar') }>
            { allPending && pctBar(pendingPercent, 'pend', 'Pending') }
            { !allPending && pctBar(passPercent, 'pass', 'Passing') }
            { !allPending && pctBar(failPercent, 'fail', 'Failing') }
          </div>
        }
      </div>
    );
  }
}

export default Navbar;
