import { Link } from 'react-router-dom';
import { Brand } from './UI';
import { useAppContext } from '../context/AppContext';

const products = [
  { id: 'stockia', name: 'MiTienda', available: true },
  { id: 'citalis', name: 'Citalis', available: false },
  { id: 'turnia', name: 'Turnia', available: false },
  { id: 'mesa', name: 'Mesa', available: false }
];

const futureProjects = ['PredicaMap', 'Asamblea-GT-JW'];

export const Footer = () => {
  const { addToast } = useAppContext();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Brand cream />
            <p>Herramientas digitales para que los negocios trabajen mejor y recuperes tu tiempo.</p>
          </div>

          <nav aria-label="Productos" className="site-footer__group">
            <h2>Productos</h2>
            <ul>
              {products.map(product => (
                <li key={product.id}>
                  <Link to={`/producto/${product.id}`}>
                    {product.name}
                    {!product.available && <span className="site-footer__status">Próximamente</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__group">
            <h2>En camino</h2>
            <ul>
              {futureProjects.map(project => (
                <li key={project}>
                  <button
                    type="button"
                    onClick={() => addToast(`${project} estará disponible próximamente.`, 'info')}
                  >
                    {project}
                    <span className="site-footer__status">Próximamente</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__group site-footer__contact">
            <h2>Contacto</h2>
            <p>Pronto compartiremos nuestros canales de atención.</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 Ahorra Tiempo</span>
          <span>Hecho para ayudarte a aprovechar mejor tu tiempo.</span>
        </div>
      </div>
    </footer>
  );
};
