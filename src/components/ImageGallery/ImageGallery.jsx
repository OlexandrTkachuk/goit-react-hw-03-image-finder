import {
  ImageGalleryItem,
  ImageGalleryItemImage,
  ImageGalleryList,
} from './ImageGallery.styled';

export const ImageGallery = ({ loadedImages }) => {
  return (
    <ImageGalleryList>
      {loadedImages.map(({ webformatURL, id, tags }) => (
        <ImageGalleryItem key={id}>
          <ImageGalleryItemImage src={webformatURL} alt={tags} />
        </ImageGalleryItem>
      ))}
    </ImageGalleryList>
  );
};
