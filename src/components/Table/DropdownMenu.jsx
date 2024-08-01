import { MenuDown } from "@/assets/icons";

const MenuDownIcon = ({ className }) => (
	<MenuDown
		className={`h-4 w-4 transform text-secondary-content opacity-100 transition-transform duration-500 group-hover:opacity-100 ${className}`}
	/>
);

const DropdownMenu = ({ open }) => {
	if (open) {
		return <MenuDownIcon className="rotate-180" />;
	}
	return <MenuDownIcon />;
};

export default DropdownMenu;
