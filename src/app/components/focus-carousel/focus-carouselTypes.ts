export interface ImageProps {
  src: string;
  alt: string;
  id: number;
}

export interface FocusCarouselTypes {
  images: ImageProps[];
  showArrows: boolean;
}
