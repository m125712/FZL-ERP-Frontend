import { router } from "@/routes";
import MainLayout from "@layouts/Main";
import { RouterProvider } from "react-router-dom";

function App() {
	return (
		<MainLayout>
			<RouterProvider router={router} />
		</MainLayout>
	);
}

export default App;
