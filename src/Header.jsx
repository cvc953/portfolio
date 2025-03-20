import React from 'react';
import './index.css'

function Header() {
  return (
    <div class="contenedor-header">
      <header>
        <div class="logo">
          <a href="#">Christian</a>
        </div>
        <nav id="nav">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#sobremi">Sobre mi</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
          <div class="nav-responsive">
            <i class="fa-solid fa-bars"></i>
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Header;
