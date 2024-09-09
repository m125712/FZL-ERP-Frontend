import { RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/Main';

// * Old
import { router } from './routes';

// * New
// import { router } from '@/test/routes/router';

function App() {
	return (
		<MainLayout>
			<RouterProvider router={router} />
		</MainLayout>
	);
}

export default App;
