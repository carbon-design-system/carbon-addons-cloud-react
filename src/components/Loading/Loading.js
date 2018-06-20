import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Lottie from 'react-lottie';
import * as animationData from './cloudwebanimation.json';
import './images/loading_logo.png';

const Loading = ({ className, title, text, ...other }) => {
  const LoadingClasses = classNames({
    'bx--cloud-loading': true,
    [className]: className,
  });

  const defaultAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={LoadingClasses} {...other}>
      <Lottie options={defaultAnimationOptions} />
    </div>
  );
};

Loading.propTypes = {
  className: PropTypes.string,
};

export default Loading;
