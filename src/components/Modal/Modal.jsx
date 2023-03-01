import { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { ModalStyled, Overlay } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  static propTypes = {
    image: PropTypes.shape({
      link: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }),
    onClose: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleBackdropClick = event => {
    const { target, currentTarget } = event;

    if (target.value === currentTarget.value) {
      this.props.onClose();
    }
  };

  render() {
    const { link, alt } = this.props.image;
    const { onLoad } = this.props;

    return createPortal(
      <Overlay onClick={this.handleBackdropClick}>
        <ModalStyled>
          <img src={link} alt={alt} onLoad={() => onLoad()} />
        </ModalStyled>
      </Overlay>,
      modalRoot
    );
  }
}
