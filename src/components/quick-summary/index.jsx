import React from 'react';
import PropTypes from 'prop-types';
import { Duration, Icon } from 'components';
import classNames from 'classnames/bind';
import styles from './quick-summary.css';

const cx = classNames.bind(styles);

const QuickSummary = ({ stats, containerStatus }) => {
  const { duration, suites, testsRegistered } = stats;

  const renderDetails = () => {
    const { passes, failures, pending, skipped } = stats;
    const { resolved = 0, reviewRequired = 0 } = containerStatus.summary ? containerStatus.summary.subtotals : {};
    const failedNum = failures - (resolved + reviewRequired);

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
          <Icon name='close' className={ cx('icon', 'circle-icon') } />{ failedNum }
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
