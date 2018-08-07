/* eslint-disable max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import { Duration, Icon } from 'components';
import { CodeSnippet, TestContext } from 'components/test';
import classNames from 'classnames/bind';
import styles from './test.css';

const cx = classNames.bind(styles);

class Test extends PureComponent {
  constructor(props) {
    super(props);

    const { test, reviewed, label } = props;
    const revieweNeeded = test.fail && !reviewed && label !== 'required';
    this.state = {
      expanded: true,
      revieweNeeded
    };
  }

  static propTypes = {
    test: PropTypes.object,
    enableCode: PropTypes.bool,
    reviewed: PropTypes.bool,
    label: PropTypes.string,
    testType: PropTypes.string
  };

  static defaultProps = {
    enableCode: false
  };

  toggleExpandedState = () => {
    if (this.state.revieweNeeded) {
      return;
    }
    const { test, enableCode } = this.props;
    if ((enableCode && test.pass) || !!test.context || test.fail || test.isHook) {
      this.setState({ expanded: !this.state.expanded });
    }
  }

  reviewApproveClick = () => {
    this.setState({ revieweNeeded: false });
    const { uuid, title } = this.props.test;
    const { testType } = this.props;
    const host = window.location.origin;
    const containerId = window.location.pathname.split('/')[3];
    superagent
      .get(`${host}/ci/test/resolve/${containerId}/${testType}/${uuid}`)
      .then(res => {
        console.info(`Resolve Endpoint for "${title}": ${res.status}`);
      })
      .catch(err => {
        console.error(`Resolve Endpoint for "${title}" ${err}`);
      })
  }

  render() {
    const { test, enableCode, label } = this.props;
    const { revieweNeeded } = this.state;
    const {
      uuid,
      title,
      speed,
      duration,
      pass,
      fail,
      pending,
      skipped,
      isHook,
      err,
      code,
      context
    } = test;

    const testIcon = () => {
      let iconName;
      let iconClassName;
      if (pass) {
        iconName = 'check';
        iconClassName = 'pass';
      }
      if (fail) {
        if (label === 'required') {
          iconName = 'close';
          iconClassName = 'fail';
        } else if (revieweNeeded) {
          iconName = 'check';
          iconClassName = 'review-required';
        } else {
          iconName = 'check';
          iconClassName = 'resolved';
        }
      }
      if (pending) {
        iconName = 'pause';
        iconClassName = 'pending';
      }
      if (skipped) {
        iconName = 'stop';
        iconClassName = 'skipped';
      }
      if (isHook) {
        if (fail) {
          iconName = 'error_outline';
        } else {
          iconName = title.match(/^"before/) ? 'rotate_left' : 'rotate_right';
        }
        iconClassName = 'hook';
      }
      if (revieweNeeded) {
        return <Icon name={ iconName } className={ cx('icon', iconClassName) } clickEvt={ this.reviewApproveClick } size={ isHook ? 24 : 18 } />;
      }
      return <Icon name={ iconName } className={ cx('icon', iconClassName) } size={ isHook ? 24 : 18 } />;
    };

    const cxname = cx('component', {
      expanded: this.state.expanded,
      passed: pass,
      failed: fail,
      pending,
      skipped,
      hook: isHook,
      inactive: pending || skipped || (pass && !enableCode && !context),
      'with-context': !!context
    });

    return (
      <section data-id={ uuid } className={ cxname }>
        <header className={ cx('header') } onClick={ this.toggleExpandedState }>
          {testIcon()}
          <h4 className={ cx('title') } title={ title }>
            {title}
          </h4>
          <div className={ cx('info') }>
            {!!context && (
              <Icon name='chat_bubble_outline' className={ cx('context-icon') } size={ 18 } />
            )}
            {!isHook && <Duration className={ cx('duration') } timer={ duration } />}
            {!isHook && <Icon name='timer' className={ cx('duration-icon', speed) } size={ 18 } />}
          </div>
        </header>
        {!!err.message && <p className={ cx('error-message') }>{err.message}</p>}
        {this.state.expanded && (
          <div className={ cx('body') }>
            {
              <CodeSnippet
                className={ cx('code-snippet') }
                code={ err.estack }
                highlight={ false }
                label='Stack Trace' />
            }
            {
              <CodeSnippet
                className={ cx('code-snippet') }
                code={ err.diff }
                lang='diff'
                label='Diff' />
            }
            {enableCode && (
              <CodeSnippet className={ cx('code-snippet') } code={ code } label='Test Code' />
            )}
            {!!context && <TestContext context={ context } />}
          </div>
        )}
      </section>
    );
  }
}

export default Test;
