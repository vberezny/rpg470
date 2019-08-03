import React from 'react';
import {
  Toast,
  ToastHeader,
  ToastBody, Button
} from 'reactstrap';
import PropTypes from 'prop-types';
import {ReactComponent as Clear} from '../../Assets/CloseIcon24px.svg';
import './CustomToast.scss';

function CustomToast(props) {
  let className = 'custom-toast';
  if (props.className) {
    className += ' ' + props.className;
  }

  let headerTextClassName = 'custom-toast-header-text';
  let bodyTextClassName = 'custom-toast-body-text';
  if (props.isSuccess) {
    className += ' bg-success';
    headerTextClassName += ' success-toast-text success-toast-header-text bg-success';
    bodyTextClassName += ' success-toast-text success-toast-body-text';
  }

  return (
    <Toast isOpen={props.isOpen} className={className}>
      <div className="custom-toast-header">
        <ToastHeader className={headerTextClassName}>
          {props.toastHeader}
        </ToastHeader>
        <Button onClick={props.handleClose} className="custom-toast-clear-button">
          <Clear className="custom-toast-clear-button-icon"/>
        </Button>
      </div>
      <ToastBody className={bodyTextClassName}>
        {props.toastBody}
      </ToastBody>
    </Toast>
  );
}

CustomToast.propTypes = {
  isOpen: PropTypes.bool,
  isSuccess: PropTypes.bool,
  handleClose: PropTypes.func,
  toastHeader: PropTypes.string,
  toastBody: PropTypes.string,
  className: PropTypes.string
};

export default CustomToast;