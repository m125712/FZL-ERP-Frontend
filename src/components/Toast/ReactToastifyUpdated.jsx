import clsx from "clsx";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// const ToastBody = ({ text }) => (
// 	<div className="flex items-center">
// 		<div className="flex-1">
// 			<p className="text-sm font-medium text-gray-900">{text}</p>
// 		</div>
// 	</div>
// );

const Icon = ({ type = "default" }) => {
	const paths = {
		success:
			"M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
		warning:
			"M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
		error: "M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z",
		default:
			"M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
	};

	return (
		<svg
			className="h-6 w-6 fill-current text-white"
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={paths[type]} />
		</svg>
	);
};

const ToastBody = ({ type = "default", text }) => {
	let bgColor, textColor, darkTextColor, name;
	switch (type) {
		case "success":
			bgColor = "bg-emerald-500";
			textColor = "text-emerald-500";
			darkTextColor = "dark:text-emerald-400";
			name = "Created";
			break;
		case "warning":
			bgColor = "bg-yellow-500";
			textColor = "text-yellow-500";
			darkTextColor = "dark:text-yellow-400";
			name = "Updated";
			break;
		case "error":
			bgColor = "bg-red-500";
			textColor = "text-red-500";
			darkTextColor = "dark:text-red-400";
			name = "Deleted";
			break;
		default:
			bgColor = "bg-blue-500";
			textColor = "text-blue-500";
			darkTextColor = "dark:text-blue-400";
			name = "Info";
	}

	return (
		<div className="flex w-full max-w-sm overflow-hidden rounded-lg bg-white ">
			<div
				className={clsx(
					"flex w-12 items-center justify-center",
					bgColor
				)}
			>
				<Icon type={type} />
			</div>
			<div className="-mx-3 px-4 py-2">
				<div className="mx-3">
					<span className={clsx("font-semibold", textColor)}>
						{name}
					</span>
					<p className="text-sm text-gray-600">{text}</p>
				</div>
			</div>
		</div>
	);
};

const SuccessToast = (text) =>
	toast.success(<ToastBody text={text} type={"success"} />);
const WarningToast = (text) =>
	toast.warn(<ToastBody text={text} type={"warning"} />);
const ErrorToast = (text) =>
	toast.error(<ToastBody text={text} type={"error"} />);

const ShowLocalToast = ({ type, message }) => {
	switch (type) {
		case "create":
			SuccessToast(message);
			break;
		case "delete":
		case "error":
			ErrorToast(message);
			break;
		case "warning":
		case "update":
			WarningToast(message);
			break;
		default:
			toast(<ToastBody text={message} />);
	}
};

const ShowToast = (toast) => {
	// console.log("toast", toast?.data);
	const { type, message } = toast?.data;
	ShowLocalToast({ ...{ type, message } });
};

const DefaultConfig = {
	position: "top-right",
	autoClose: 50000,
	hideProgressBar: true,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	closeButton: false,
	icon: false,
};

const Toast = () => {
	return (
		<ToastContainer
			bodyClassName="p-0 m-0"
			progressClassName={"bg-blue-500 m-0 p-0"}
			// style={{ width: "auto", background: "red", padding: 0 }}
			transition={Slide}
			{...DefaultConfig}
		/>
	);
};

export {
	ErrorToast,
	ShowLocalToast,
	ShowToast,
	SuccessToast,
	Toast,
	WarningToast,
};
