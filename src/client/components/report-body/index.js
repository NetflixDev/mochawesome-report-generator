import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import superagent from 'superagent';
import { Suite } from 'components/suite';
import cx from 'classnames';

@inject('reportStore')
@observer
class ReportBody extends React.Component {
  constructor(props) {
    super(props);

    const { setContainerStatus } = props.reportStore;
    const url = './status.json';
    superagent
      .get(url)
      .then(res => {
        setContainerStatus(res.body);
      })
      .catch(err => {
        console.error(err);
      })
  }
  static propTypes = {
    reportStore: PropTypes.object,
  };

  updateSuites(timeout) {
    this.props.reportStore.updateFilteredSuites(timeout);
  }

  updatePageScrollPos = () => {
    const { hash } = document.location;
    if (hash) {
      const selector = `[data-id='${hash.replace('#', '')}']`;
      const node = document.querySelector(selector);
      if (!node) {
        return;
      }

      const top = node.getBoundingClientRect().y - 70;
      document.documentElement.scrollTop = top;
    }
  }

  componentDidUpdate() {
    if (this.props.reportStore.filteredSuites.length > 0 && !this.scrolled) {
      this.scrolled = true;
      this.updatePageScrollPos();
    }
  }

  componentDidMount() {
    this.updateSuites();
    // this.updatePageScrollPos();
    // console.log(this.props.reportStore.filteredSuites)
    this.disposer = reaction(
      () => {
        const {
          showPassed,
          showFailed,
          showPending,
          showSkipped,
          showHooks,
        } = this.props.reportStore;
        return {
          showPassed,
          showFailed,
          showPending,
          showSkipped,
          showHooks,
        };
      },
      () => this.updateSuites(0),
      { delay: 300 }
    );
  }

  componentWillUnmount() {
    this.disposer();
  }

  updateSuites(timeout) {
    this.props.reportStore.updateFilteredSuites(timeout);
  }

  render() {
    const {
      enableCode,
      enableChart,
      filteredSuites: suites,
      containerStatus
    } = this.props.reportStore;
    const { container = '', output = '' } = containerStatus.routes ? containerStatus.routes : {};

    return (
      <div id='details' className={ cx('details', 'container') }>
        <div className='info-links'>
          {output && <a href={ output }>Output Log</a>}
          {container && <a href={ container }>Container Preview</a>}
        </div>
        { suites.map(suite => (
          <Suite
            key={suite.uuid}
            suite={suite}
            enableChart={enableChart}
            enableCode={enableCode}
          />
        ))}
      </div>
    );
  }
}

export default ReportBody;
