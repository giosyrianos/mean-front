export  interface Post {
  title: string;
  content: string;
  id?: string;
  imgPath: string;
  owner: string;
  bids?: any[];
  category: string;
  subCategory: string;
  devId?: string;
  tasks?: any[];
}
