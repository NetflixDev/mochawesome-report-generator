import React from 'react';
import PropTypes from 'prop-types';
import { Test } from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

const TestList = ({ className, tests, beforeHooks, afterHooks, enableCode, containerStatus }) => {
  const { failReviews, screenshotReviews } = containerStatus.summary.subtotals;
  const reviewObj = { ...failReviews, ...screenshotReviews };
  const reviewedIds = Object.keys(reviewObj).filter(key => reviewObj[key]);

  return (
    <div className={ cx(className) }>
      { !!beforeHooks && beforeHooks.map(test => (
        <Test key={ test.uuid } test={ test } enableCode={ enableCode } />))
      }
      { !!tests && tests.map(test => (
        <Test key={ test.uuid } test={ test } enableCode={ enableCode } reviewed={ reviewedIds.includes(test.uuid) } />))
      }
      { !!afterHooks && afterHooks.map(test => (
        <Test key={ test.uuid } test={ test } enableCode={ enableCode } />))
      }
    </div>
  );
}

TestList.propTypes = {
  className: PropTypes.string,
  tests: PropTypes.array,
  beforeHooks: PropTypes.array,
  afterHooks: PropTypes.array,
  enableCode: PropTypes.bool,
  containerStatus: PropTypes.object
};

TestList.displayName = 'TestList';

export default TestList;
