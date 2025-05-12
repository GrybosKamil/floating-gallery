export type Painting = {
  id?: number;
  title: string;
  year: number;
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
};
