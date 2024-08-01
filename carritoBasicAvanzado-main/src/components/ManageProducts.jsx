// Importa las librerías necesarias desde React y axios, y el componente ProductModal.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';

// Define el componente funcional ManageProducts.
const ManageProducts = () => {
  // Define el estado products para almacenar la lista de productos.
  const [products, setProducts] = useState([]);
  // Define el estado showModal para controlar la visibilidad del modal de producto.
  const [showModal, setShowModal] = useState(false);
  // Define el estado productToEdit para almacenar el producto que se va a editar.
  const [productToEdit, setProductToEdit] = useState(null);
  // Define el estado searchQuery para almacenar la consulta de búsqueda.
  const [searchQuery, setSearchQuery] = useState('');
  // Define el estado errorMessage para almacenar mensajes de error.
  const [errorMessage, setErrorMessage] = useState('');
  // Define el estado successMessage para almacenar mensajes de éxito.
  const [successMessage, setSuccessMessage] = useState('');

  // Función para obtener la lista de productos desde el servidor.
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/productos');
      setProducts(response.data);
    } catch (error) {
      setErrorMessage('Error al obtener los productos');
    }
  };

  // useEffect para obtener los productos cuando el componente se monta.
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para manejar la eliminación de un producto.
  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/productos/${id}`);
      fetchProducts();
      setSuccessMessage(response.data.mensaje || 'Producto eliminado con éxito');
      setTimeout(() => setSuccessMessage(''), 1000);
    } catch (error) {
      setErrorMessage('Error al eliminar el producto');
    }
  };

  // Función para manejar la edición de un producto.
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  // Función para manejar la adición de un nuevo producto.
  const handleAddProduct = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  // Función para manejar la búsqueda de productos.
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/productos/busqueda/${searchQuery}`);
      setProducts(response.data);
      if (response.data.length === 0) {
        setErrorMessage('No se encontraron productos');
      }
    } catch (error) {
      setErrorMessage('Error al buscar productos');
    }
  };

  // Renderiza el componente ManageProducts.
  return (
    <div>
      <h2>Gestión de Productos</h2>
      <button onClick={handleAddProduct}>Agregar Producto</button>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar productos..."
        />
        <button type="submit">Buscar</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <table className="tablaProductos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>${product.precio}</td>
              <td>{product.stock}</td>
              <td>
                {product.imagen && <img src={`http://localhost:5000/uploads/${product.imagen}`} alt={product.nombre} width="100" />}
              </td>
              <td>
                <button className="edit-button" onClick={() => handleEditProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        fetchProducts={fetchProducts}
        productToEdit={productToEdit}
      />
    </div>
  );
};

// Exporta el componente ManageProducts para que pueda ser utilizado en otros archivos.
export default ManageProducts;
