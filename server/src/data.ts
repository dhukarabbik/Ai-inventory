export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
}

export let products: Product[] = [
  {
    id: 'p1',
    name: 'Classic T-Shirt',
    category: 'Apparel',
    stock: 120,
    price: 25.99,
    supplier: 'Supplier A',
  },
  {
    id: 'p2',
    name: 'Running Shoes',
    category: 'Footwear',
    stock: 75,
    price: 89.99,
    supplier: 'Supplier B',
  },
  {
    id: 'p3',
    name: 'Leather Wallet',
    category: 'Accessories',
    stock: 200,
    price: 49.99,
    supplier: 'Supplier A',
  },
  {
    id: 'p4',
    name: 'Denim Jeans',
    category: 'Apparel',
    stock: 90,
    price: 75.0,
    supplier: 'Supplier C',
  },
  {
    id: 'p5',
    name: 'Smartwatch',
    category: 'Electronics',
    stock: 50,
    price: 249.99,
    supplier: 'Supplier D',
  },
];

export interface Sale {
  productId: string;
  date: string;
  amount: number;
}

export let sales: Sale[] = [];
