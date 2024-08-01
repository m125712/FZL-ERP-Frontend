import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const ToastBody = ({ text }) => (
	<div className="flex items-center">
		<p className="text-sm font-medium text-gray-900">{text}</p>
	</div>
);

const SuccessToast = (text) => toast.success(<ToastBody {...{ text }} />);
const WarningToast = (text) => toast.warn(<ToastBody {...{ text }} />);
const ErrorToast = (text) => toast.error(<ToastBody {...{ text }} />);

const ShowLocalToast = ({ type, message }) => {
	switch (type) {
		case "create":
		case "update":
			SuccessToast(message);
			break;
		case "delete":
		case "error":
			ErrorToast(message);
			break;
		case "warning":
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
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	closeButton: false,
};

const Toast = () => {
	return (
		<ToastContainer
			style={{ width: "auto" }}
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
