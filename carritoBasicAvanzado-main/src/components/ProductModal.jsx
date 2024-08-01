// Importa las librerías necesarias desde React y axios.
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define el componente funcional ProductModal, con sus props.
const ProductModal = ({ showModal, closeModal, fetchProducts, productToEdit }) => {
  // Define los datos iniciales del producto.
  const initialProductData = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: null
  };

  // Define el estado productData para almacenar los datos del producto.
  const [productData, setProductData] = useState(initialProductData);
  // Define el estado errorMessage para almacenar mensajes de error.
  const [errorMessage, setErrorMessage] = useState('');
  // Define el estado successMessage para almacenar mensajes de éxito.
  const [successMessage, setSuccessMessage] = useState('');

  // useEffect para cargar los datos del producto a editar cuando cambia productToEdit.
  useEffect(() => {
    if (productToEdit) {
      // Si hay un producto para editar, llena el estado con sus datos.
      setProductData({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        imagen: null
      });
    } else {
      // Si no hay producto para editar, restablece el estado a los datos iniciales.
      setProductData(initialProductData);
    }
  }, [productToEdit]);

  // Maneja los cambios en los inputs del formulario.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  // Maneja los cambios en el input de archivo (imagen).
  const handleFileChange = (e) => {
    setProductData({
      ...productData,
      imagen: e.target.files[0]
    });
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Agrega cada campo del producto al FormData.
    formData.append('nombre', productData.nombre);
    formData.append('descripcion', productData.descripcion);
    formData.append('precio', productData.precio);
    formData.append('stock', productData.stock);
    formData.append('imagen', productData.imagen);

    try {
      let response;
      if (productToEdit) {
        // Si hay un producto para editar, realiza una solicitud PUT.
        response = await axios.put(`http://localhost:5000/api/productos/${productToEdit._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Si no hay producto para editar, realiza una solicitud POST.
        response = await axios.post('http://localhost:5000/api/productos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      // Muestra un mensaje de éxito y actualiza la lista de productos.
      setSuccessMessage(response.data.mensaje || 'Operación exitosa');
      fetchProducts();
      // Restablece el formulario a los datos iniciales.
      setProductData(initialProductData);
      // Cierra el modal después de 2 segundos.
      setTimeout(() => {
        closeModal();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      // Muestra un mensaje de error si algo sale mal.
      setErrorMessage(error.response?.data?.mensaje || 'Error al guardar el producto');
    }
  };

  // Si no se debe mostrar el modal, retorna null.
  if (!showModal) {
    return null;
  }

  // Renderiza el modal con el formulario.
  return (
    <div className="modalProducto-overlay">
      <div className="modalProducto">
        <button className="modalProducto-close" onClick={closeModal}>×</button>
        <h2>{productToEdit ? 'Actualizar Producto' : 'Agregar Producto'}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="nombre" value={productData.nombre} onChange={handleInputChange} />
          </label>
          <label>
            Descripción:
            <input type="text" name="descripcion" value={productData.descripcion} onChange={handleInputChange} />
          </label>
          <label>
            Precio:
            <input type="number" name="precio" value={productData.precio} onChange={handleInputChange} />
          </label>
          <label>
            Stock:
            <input type="number" name="stock" value={productData.stock} onChange={handleInputChange} />
          </label>
          <label>
            Imagen:
            <input type="file" name="imagen" onChange={handleFileChange} />
          </label>
          <button type="submit">{productToEdit ? 'Actualizar' : 'Agregar'}</button>
        </form>
      </div>
    </div>
  );
};

// Exporta el componente ProductModal para que pueda ser utilizado en otros archivos.
export default ProductModal;
