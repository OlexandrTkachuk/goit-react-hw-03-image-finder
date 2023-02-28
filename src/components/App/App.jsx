import { Component } from 'react';
import { Container } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { ImSpinner } from 'react-icons/im';
import { fetchPixabay } from 'services/pixabay-api';
import { Button } from 'components/Button/Button';

export class App extends Component {
  state = {
    searchQuery: '',
    loadedImages: [],
    page: 1,
    error: null,
    status: 'idle',
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { page, loadedImages, searchQuery } = this.state;
    const prevQueryValue = prevState.searchQuery;
    const currentQueryValue = searchQuery;

    if (prevQueryValue !== currentQueryValue || prevState.page !== page) {
      this.setState({ status: 'pending' });

      fetchPixabay(searchQuery, page)
        .then(data => {
          this.showNotification(data);

          if (data.hits.length === 0) {
            this.setState({ status: 'rejected' });
            return;
          } else {
            return this.setState({
              loadedImages: [...loadedImages, ...data.hits],
              status: 'resolved',
            });
          }
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
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

  render() {
    const { loadedImages, status, searchQuery } = this.state;

    return (
      <Container>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {status === 'idle' && <div>Введіть текст для пошуку зображення</div>}

        {status === 'pending' && (
          <div>
            <ImSpinner size="32" className="icon-spin" />
            Загружаем...
          </div>
        )}

        {status === 'rejected' && (
          <div>
            <p>Пошук за значенням {searchQuery} не дав результату</p>
          </div>
        )}

        {status === 'resolved' && <ImageGallery loadedImages={loadedImages} />}

        {loadedImages.length > 0 && (
          <Button text="Load more" onClick={this.handleLoadMoreClick}></Button>
        )}

        <ToastContainer />
      </Container>
    );
  }
}
