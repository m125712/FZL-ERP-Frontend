import { RouterProvider } from 'react-router-dom';
import { router } from '../src/test/routes/router';
import MainLayout from './layouts/Main';

function App() {
	return (
		<MainLayout>
			<RouterProvider router={router} />
		</MainLayout>
	);
}

export default App;
