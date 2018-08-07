import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

@inject('reportStore') @observer
// TODO: inject observer and parse failed
// TODO: add 'resolved' 'review-pending'

class QuickSummary extends React.Component {
  // constructor()
  static propTypes = {
    stats: PropTypes.object,
    reportStore: PropTypes.object
  };

  static getReviewStats(failReviews, screenshotReviews) {
    let resolved = 0;
    let reviewRequired = 0;
    const items = { ...failReviews, ...screenshotReviews };
    Object.keys(items).forEach(key => {
      if (items[key].resolved) {
        resolved += 1;
      } else {
        reviewRequired += 1;
      }
    });
    return {
      resolved,
      reviewRequired
    };
  }

  renderDetails() {
    const { passes, failures, pending, skipped } = this.props.stats;
    const { failReviews, screenshotReviews } = this.props.reportStore.containerStatus.summary.subtotals;
    const { resolved, reviewRequired } = QuickSummary.getReviewStats(failReviews, screenshotReviews);
    return (
      <ul className={ cx('list') }>
        <li className={ cx('item', 'passes') } title='Passed'>
          <Icon name='check' className={ cx('icon', 'circle-icon') } />{ passes }
        </li>
        { !!resolved && (
          <li className={ cx('item', 'resolved') } title='Resolved'>
            <Icon name='check' className={ cx('icon', 'circle-icon') } />{ resolved }
          </li>)
        }
        { !!reviewRequired && (
          <li className={ cx('item', 'review-required') } title='ReviewRequired'>
            <Icon name='close' className={ cx('icon', 'circle-icon') } />{ reviewRequired }
          </li>)
        }
        <li className={ cx('item', 'failures') } title='Failed'>
          <Icon name='close' className={ cx('icon', 'circle-icon') } />{ failures }
        </li>
        { !!pending && (
          <li className={ cx('item', 'pending') } title='Pending'>
            <Icon name='pause' className={ cx('icon', 'circle-icon') } />{ pending }
          </li>)
        }
        { !!skipped && (
          <li className={ cx('item', 'skipped') } title='Skipped'>
            <Icon name='stop' className={ cx('icon', 'circle-icon') } />{ skipped }
          </li>)
        }
      </ul>
    )
  }

  render() {
    const { duration, suites, testsRegistered } = this.props.stats;
    const { containerStatus } = this.props.reportStore;

    return (
      <div className={ cx('cnt') }>
        <ul className={ cx('list') }>
          <li className={ cx('item', 'duration') } title='Duration'>
            <Icon name='timer' className={ cx('icon') } />
            <Duration unitsClassName={ cx('duration-units') } timer={ duration } isSummary />
          </li>
          <li className={ cx('item', 'suites') } title='Suites'>
            <Icon name='library_books' className={ cx('icon') } />{ suites }
          </li>
          <li className={ cx('item', 'tests') } title='Tests'>
            <Icon name='assignment' className={ cx('icon') } />{ testsRegistered }
          </li>
        </ul>
        { !!containerStatus.summary && this.renderDetails()}
      </div>
    );
  }
}

export default QuickSummary;
