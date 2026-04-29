import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { renderLogin } from './pages/login';

const app = document.getElementById('app')!;

const token = sessionStorage.getItem('token');
if (token) {
  import('./pages/todasMascotas').then(({ renderTodasMascotas }) => renderTodasMascotas(app));
} else {
  renderLogin(app);
}