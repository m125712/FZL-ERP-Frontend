import { RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/Main';

import { router } from '@/routes/router';

function App() {
	return (
		<MainLayout>
			<RouterProvider router={router} />
		</MainLayout>
	);
}

export default App;
