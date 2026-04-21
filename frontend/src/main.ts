import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { renderLogin } from './pages/login';

const app = document.getElementById('app')!;
renderLogin(app);