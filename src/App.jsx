import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [AllProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [pop, setPop] = useState(false);
  const prompt = useRef(null);

  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=100").then((res) => {
      console.log(res);
      setAllProducts(res.data.products);
      setFilteredProducts(res.data.products);
      var filter = {
        categories: [],
        brands: [],
      };
      res.data.products.map((x) => {
        if (filter.categories.includes(x.category)) {
          if (filter.brands.includes(x.brand)) {
            return null;
          } else {
            filter.brands.push(x.brand);
          }
        } else {
          filter.categories.push(x.category);
          if (filter.brands.includes(x.brand)) {
            return null;
          } else {
            filter.brands.push(x.brand);
          }
        }
      });
      setCategories(filter.categories);
      setBrands(filter.brands);
    });
  }, []);

  const filter = (e) => {
    if (e.target.name === "category") {
      setFilteredProducts(
        AllProducts.filter((x) => {
          return x.category === e.target.value;
        })
      );
    } else if (e.target.name === "brand") {
      setFilteredProducts(
        AllProducts.filter((x) => {
          return x.brand === e.target.value;
        })
      );
    }
  };

  const sort = (e) => {
    if (e.target.value === "Price") {
      setFilteredProducts((pValue) => {
        return [...pValue].sort((p1, p2) =>
          p1.price < p2.price ? 1 : p1.price > p2.price ? -1 : 0
        );
      });
    } else if (e.target.value === "Rating") {
      setFilteredProducts((pValue) => {
        return [...pValue].sort((p1, p2) =>
          p1.rating < p2.rating ? 1 : p1.rating > p2.rating ? -1 : 0
        );
      });
    } else if (e.target.value === "Discount") {
      setFilteredProducts((pValue) => {
        return [...pValue].sort((p1, p2) =>
          p1.discountPercentage < p2.discountPercentage
            ? 1
            : p1.discountPercentage > p2.discountPercentage
            ? -1
            : 0
        );
      });
    }
  };

  const handleCart = (stock) => {
    setCartCount(cartCount+1)
    if(stock<50) {
      setPop(true)
      setTimeout(() => {
        prompt.current.classList.add('fade')
      }, 1500)
      setTimeout(() => {
        setPop(false)
        prompt.current.classList.remove('fade')
      }, 2500)
    }
  }

  return (
    <div>
      {pop && 
        <div ref={prompt} className="prompt">
          Hurry! Only a few items left.
        </div>}
        <div className="cart">
        <h3>Cart Items: {cartCount}</h3>
        </div>
      <div className="header">
        <h1 className="logo">Centrik Products</h1>
        <div className="header-options">
          <div className="filter">
            <h3>Filter:</h3>
            <select onChange={filter} name="category">
              <option value="">All Categories</option>
              {categories.map((x) => {
                return <option value={x}>{x}</option>;
              })}
            </select>
            <select onChange={filter} name="brand">
              <option value="">All Brands</option>
              {brands.map((x) => {
                return <option value={x}>{x}</option>;
              })}
            </select>
          </div>
          <div className="sort">
            <h3>Sort By:</h3>
            <select onChange={sort} name="sort">
              <option value="">Select</option>
              <option value="Rating">Rating</option>
              <option value="Price">Price</option>
              <option value="Discount">Discount</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        {filteredProducts.map((x) => {
          return (
            <div className="product-card">
              <img src={x.thumbnail} alt="" />
              <div>
                <h2>{x.title}</h2>
                <p>{x.description}</p>
                <h3>
                  ${x.price}{" "}
                  <span className="red">{x.discountPercentage}% off</span>
                </h3>
                <h4>Rating: {x.rating}/5</h4>
                <button onClick={() => handleCart(x.stock)}>Add To Cart</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
