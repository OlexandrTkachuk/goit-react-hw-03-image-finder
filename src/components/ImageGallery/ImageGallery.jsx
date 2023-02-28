import { Component } from 'react';
import { fetchPixabay } from 'services/pixabay-api';
import { ImSpinner } from 'react-icons/im';
import {
  ImageGalleryItem,
  ImageGalleryItemImage,
  ImageGalleryList,
} from './ImageGallery.styled';

export class ImageGallery extends Component {
  state = {
    images: [],
    error: null,
    status: 'idle',
    page: 1,
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { page } = this.state;
    const { searchQuery } = this.props;
    const prevQueryValue = prevProps.searchQuery;
    const currentQueryValue = searchQuery;

    if (prevQueryValue !== currentQueryValue) {
      this.setState({ status: 'pending' });

      fetchPixabay(searchQuery, page)
        .then(data =>
          this.setState({ images: [...data.hits], status: 'resolved' })
        )
        .catch(error => {
          console.log(error);
          return this.setState({ error, status: 'rejected' });
        });
    }
  };

  render() {
    const { images, error, status } = this.state;

    if (status === 'idle') {
      return <div>Введіть текст для пошуку зображення</div>;
    }

    if (status === 'pending') {
      return (
        <div>
          <ImSpinner size="32" className="icon-spin" />
          Загружаем...
        </div>
      );
    }

    if (status === 'rejected') {
      return (
        <div>
          <p>{error.message}</p>
        </div>
      );
    }

    if (status === 'resolved') {
      return (
        <ImageGalleryList>
          {images.map(({ webformatURL, id, tags }) => (
            <ImageGalleryItem key={id}>
              <ImageGalleryItemImage src={webformatURL} alt={tags} />
            </ImageGalleryItem>
          ))}
        </ImageGalleryList>
      );
    }
  }
}
