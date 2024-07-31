// Importa las librerías necesarias desde React y react-router-dom.
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define el componente funcional Header, que recibe cartCount como prop.
const Header = ({ cartCount }) => {
  // Define un estado user para almacenar los datos del usuario obtenidos desde el localStorage.
  const [user, setUser] = useState({
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role')
  });
  // useNavigate hook para redirigir al usuario después de logout.
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión.
  const handleLogout = () => {
    // Remueve los datos del usuario del localStorage.
    ['username', 'token', 'role', 'userId'].forEach(item => localStorage.removeItem(item));
    // Resetea el estado user.
    setUser({ username: null, role: null });
    // Redirige al usuario a la página principal.
    navigate('/');
  };

  // useEffect para actualizar el estado user cuando cambian los datos en el localStorage.
  useEffect(() => {
    // Función para manejar cambios en el almacenamiento local.
    const handleStorageChange = () => {
      // Actualiza el estado user con los nuevos datos del localStorage.
      setUser({
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      });
    };

    // Agrega un event listener para cambios en el almacenamiento local.
    window.addEventListener('storage', handleStorageChange);
    // Limpia el event listener cuando el componente se desmonta.
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Renderiza el componente Header.
  return (
    <header className="header">
      <h1>SGCI</h1>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/cart">Carrito ({cartCount})</Link>
        <Link to="/sales-report">Reporte de Ventas</Link>
        {user.role === 'admin' && <Link to="/manage-products">G. Productos</Link>}
        {user.role === 'admin' && <Link to="/manage-orders">G. Pedidos</Link>} {/* Link a la gestión de pedidos */}
        {user.username ? (
          <>
            <Link to="/pedidos">Mis Pedidos</Link> {/* Enlace a los pedidos */}
            <span>  <Link to="/update-user">Bienvenido, {user.username} ({user.role})</Link></span>
            <Link to="/" onClick={handleLogout}>Cerrar S.</Link>
          </>
        ) : (
          <>
            <Link to="/register">Registro</Link>
            <Link to="/login">Ingresar</Link>
          </>
        )}
      </nav>
    </header>
  );
};

// Exporta el componente Header para que pueda ser utilizado en otros archivos.
export default Header;
