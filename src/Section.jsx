import React from 'react';

function Section() {
  return (
    <>
      <section id="inicio" className='inicio'>
        <div className='contenedor-banner'>
          <div className='contenedor-img'>

          </div>
          <h1>Christian Villalobos</h1>
          <p>Desarrollador Frontend</p>
          <div class="redes">
            <a href='#'><i class="fab fa-linkedin"></i></a>
            <a href='http://github.com/cvc953'><i class="fab fa-github"></i></a>
          </div>
          <button>
            Descargar CV <i className='fas fa-download'></i>
            <span className='overlay'></span>
          </button>
        </div>
      </section>
    </>
  )
};
export default Section;

