import { Close } from "@/assets/icons";

const Header = ({ title, onClose }) => (
	<div className="modal-header mb-6 flex items-center justify-between">
		<p className="mb-0 text-2xl font-semibold">{title}</p>
		<button
			type="button"
			onClick={onClose}
			className="group btn btn-circle btn-outline btn-error btn-sm"
		>
			<Close className="h-5 w-5 text-error group-hover:text-primary-content" />
		</button>
	</div>
);

const Footer = () => (
	<div className="modal-action">
		<button type="submit" className="text-md btn btn-primary btn-block">
			Save
		</button>
	</div>
);

const DeleteFooter = ({ handelCancelClick }) => (
	<div className="modal-action">
		<button type="submit" className="btn btn-outline btn-error">
			Delete
		</button>
		<button
			type="button"
			onClick={handelCancelClick}
			className="btn btn-primary"
		>
			Cancel
		</button>
	</div>
);

export { DeleteFooter, Footer, Header };
