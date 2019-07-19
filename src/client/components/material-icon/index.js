/* eslint-disable react/no-danger, max-len */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import iconmap from './icon-map.json';

class Icon extends PureComponent {
  render() {
    const { className, name, size, foreground, clickEvt } = this.props;
    const iconCode = iconmap[name];
    const cxName = classNames(
      'material-icons',
      !!size && `md-${size}`,
      !!foreground && `md-${foreground}`,
      className
    );
    if (!iconCode) {
      return null;
    } else if (this.props.clickEvt) {
      return <i className={ cxName } dangerouslySetInnerHTML={ { __html: `&#x${iconCode};` } } onClick={ clickEvt } />
    }

    return <i className={ cxName } dangerouslySetInnerHTML={ { __html: `&#x${iconCode};` } } />;
  }
}

Icon.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf([ 18, 24, 36, 48 ]),
  foreground: PropTypes.oneOf([ 'light', 'dark' ]),
  clickEvt: PropTypes.func
};

Icon.displayName = 'MaterialIcon';

export default Icon;
