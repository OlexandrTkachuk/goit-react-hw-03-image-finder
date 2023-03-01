import { Component } from 'react';
import { Container } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

import { fetchPixabay } from 'services/pixabay-api';
import PacmanLoader from 'react-spinners/PacmanLoader';

export class App extends Component {
  state = {
    searchQuery: '',
    loadedImages: [],
    page: 1,
    error: null,
    status: 'idle',
    isModalOpen: false,
    imageInModal: {
      link: '',
      alt: '',
    },
    totalPages: 0,
  };

  componentDidUpdate = (_, prevState) => {
    const { page, loadedImages, searchQuery } = this.state;
    const prevQueryValue = prevState.searchQuery;
    const currentQueryValue = searchQuery;

    if (prevQueryValue !== currentQueryValue || prevState.page !== page) {
      try {
        this.setState({ status: 'pending' });

        fetchPixabay(searchQuery, page).then(data => {
          this.showNotification(data);

          this.setState({
            loadedImages: [...loadedImages, ...data.hits],
            status: 'resolved',
            totalPages: Math.floor(data.totalHits / 12),
          });
        });
      } catch (error) {
        this.setState({ error: true });

        toast.error('Oops, something went wrong :(');

        console.log(error);
      }
    }
  };

  showNotification = data => {
    if (this.state.page === 1) {
      data.hits.length > 0
        ? toast.success(`Wow! We found ${data.total} results!`)
        : toast.warn(`Sorry, but there are no results for your query`);
    }
  };

  handleFormSubmit = inputValue => {
    this.setState({ searchQuery: inputValue, loadedImages: [], page: 1 });
  };

  handleLoadMoreClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleImageClick = image => {
    const { largeImageURL, tags } = image;

    this.setState({
      status: 'pending',
      isModalOpen: true,
      imageInModal: {
        link: largeImageURL,
        alt: tags,
      },
    });
  };

  handleModalImageLoaded = () => {
    this.setState({ status: 'resolved' });
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const {
      loadedImages,
      status,
      searchQuery,
      isModalOpen,
      imageInModal,
      totalPages,
      page,
    } = this.state;

    return (
      <Container>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {status === 'idle' && (
          <div style={{ textAlign: 'center' }}>
            Введіть текст для пошуку зображення
          </div>
        )}

        {status === 'pending' && (
          <PacmanLoader
            color="#3f51b5"
            size="30px"
            cssOverride={{
              display: 'block',
              margin: '0 auto ',
              borderColor: '#3f51b5',
            }}
          />
        )}

        {status === 'rejected' && (
          <div>
            <p>Пошук за значенням {searchQuery} не дав результату</p>
          </div>
        )}

        {status === 'resolved' && (
          <ImageGallery
            loadedImages={loadedImages}
            onClick={this.handleImageClick}
          />
        )}

        {loadedImages.length > 0 &&
          status !== 'pending' &&
          page <= totalPages && (
            <Button
              text="Load more"
              onClick={this.handleLoadMoreClick}
            ></Button>
          )}

        {isModalOpen && (
          <Modal
            image={imageInModal}
            onClose={this.handleModalClose}
            onLoad={this.handleModalImageLoaded}
          ></Modal>
        )}

        <ToastContainer />
      </Container>
    );
  }
}
