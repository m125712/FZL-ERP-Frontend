import { Outlet } from 'react-router-dom';

const Page = () => {
	return (
		<div>
			<h1>This is Protected Page</h1>
			<Outlet />
		</div>
	);
};

export default Page;
