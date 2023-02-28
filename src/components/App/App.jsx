import { Component } from 'react';
import { Container } from './App.styled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';

export class App extends Component {
  state = {
    searchQuery: '',
  };

  handleFormSubmit = inputValue => {
    this.setState({ searchQuery: inputValue });
  };

  render() {
    const { searchQuery } = this.state;

    return (
      <Container>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery searchQuery={searchQuery} />
        <ToastContainer />
      </Container>
    );
  }
}
