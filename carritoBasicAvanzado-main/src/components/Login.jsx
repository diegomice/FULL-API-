// Importa las librerías necesarias desde React, axios y react-router-dom.
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define el componente funcional Login.
const Login = () => {
  // Define un estado formData para almacenar los valores del formulario de login.
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Define un estado message para almacenar mensajes de éxito o error.
  const [message, setMessage] = useState('');
  // useNavigate hook para redirigir al usuario después de un login exitoso.
  const navigate = useNavigate();

  // Maneja el cambio en los campos del formulario.
  const handleChange = (e) => {
    // Desestructura el nombre y el valor del elemento que generó el evento.
    const { name, value } = e.target;
    // Actualiza el estado formData con el nuevo valor.
    setFormData({ ...formData, [name]: value });
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e) => {
    // Previene el comportamiento por defecto del formulario de recargar la página.
    e.preventDefault();
    try {
      // Realiza una solicitud POST a la API de login.
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      // Muestra un mensaje de éxito.
      setMessage('Login exitoso');
      // Almacena el token en el localStorage.
      localStorage.setItem('token', response.data.token);
      // Almacena el nombre de usuario en el localStorage.
      localStorage.setItem('username', response.data.username);
      // Almacena el rol del usuario en el localStorage.
      localStorage.setItem('role', response.data.role);
      // Almacena el ID del usuario en el localStorage.
      localStorage.setItem('userId', response.data.userId);
      // Almacena el email en el localStorage.
      localStorage.setItem('email', response.data.email);
      // Dispara un evento de almacenamiento para notificar a otros componentes de la actualización.
      window.dispatchEvent(new Event('storage'));
      // Redirige al usuario a la página principal.
      navigate('/');
    } catch (error) {
      // Muestra un mensaje de error si la solicitud falla.
      setMessage(error.response?.data?.error || 'Error en el login');
    }
  };

  // Renderiza el formulario de login.
  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p>{message}</p>}
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Exporta el componente Login para que pueda ser utilizado en otros archivos.
export default Login;
