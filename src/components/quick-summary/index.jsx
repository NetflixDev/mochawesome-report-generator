import React from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

const QuickSummary = ({ stats, containerStatus }) => {

  const { duration, suites, testsRegistered } = stats;

  const getReviewStats = (failReviews, screenshotReviews) => {
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
  };

  const renderDetails = () => {
    const { passes, failures, pending, skipped } = stats;
    const { failReviews, screenshotReviews } = containerStatus.summary.subtotals;
    const { resolved, reviewRequired } = getReviewStats(failReviews, screenshotReviews);
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
    );
  };

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
      { !!containerStatus.summary && renderDetails()}
    </div>
  );
}

QuickSummary.propTypes = {
  stats: PropTypes.object,
  containerStatus: PropTypes.object
}

export default QuickSummary;
