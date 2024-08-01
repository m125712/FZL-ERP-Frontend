import { Suspense } from "@/components/Feedback";
import { Outlet, useLocation } from "react-router-dom";
import { Aside, MobileHeader } from "./components";

const Drawer = () => {
	const location = useLocation();
	const isHidden = location?.pathname.includes("/login", "/") ? true : false;
	const id = "navbar-drawer";

	return (
		<div className="drawer md:drawer-open">
			<input id={id} type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col overflow-x-hidden">
				<main className="flex-1 overflow-x-hidden md:min-h-screen">
					{!isHidden && <MobileHeader {...{ id }} />}
					<Suspense>
						<Outlet />
					</Suspense>
				</main>
			</div>
			{!isHidden && <Aside {...{ id }} />}
		</div>
	);
};

export default Drawer;
