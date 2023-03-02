import { Component } from 'react';
import { toast } from 'react-toastify';
import { MdImageSearch } from 'react-icons/md';
import PropTypes from 'prop-types';
import {
  Header,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';

export class Searchbar extends Component {
  state = {
    inputValue: '',
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  handleInputChange = event => {
    const value = event.currentTarget.value.toLowerCase();

    this.setState({ inputValue: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { inputValue } = this.state;

    if (inputValue.trim() === '') {
      toast.error(`Введіть текст для пошуку зображення`);
      return;
    }

    this.props.onSubmit(inputValue);

    this.resetForm();
  };

  resetForm = () => {
    this.setState({ inputValue: '' });
  };

  render() {
    const { inputValue } = this.state;

    return (
      <Header>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchFormButton type="submit">
            <MdImageSearch size="30px" fill="red" />
          </SearchFormButton>

          <SearchFormInput
            onChange={this.handleInputChange}
            value={inputValue}
            name="inputValue"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </SearchForm>
      </Header>
    );
  }
}
