
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, FormControl } from 'react-bootstrap';

const API_URL = 'https://dummyjson.com/products';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
       //.then(console.log)
      .then(data => {
        if (Array.isArray(data)) {
           setProducts(data[0].products);
        } else {
          // If the data is not an array, convert it to an array with a single element
          setProducts([data.products]);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
      console.log(products)
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const filteredProducts = products[0]?.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Row>
        <Col md={4}>
          <h2>Products</h2>
          <Form.Group controlId="search">
            <FormControl
              type="text"
              placeholder="Search by name or category"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          {filteredProducts?.map(product => (
            <Card key={product.id} className="mb-3">
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
                <Card.Text>{product.description}</Card.Text>
                <Button onClick={() => addToCart(product)}>Add to Cart</Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={8}>
          <h2>Cart</h2>
          {cart.map(item => (
            <Card key={item.id} className="mb-3">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>Quantity: {item.quantity}</Card.Text>
                <Button onClick={() => removeFromCart(item.id)}>Remove</Button>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                />
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default App
