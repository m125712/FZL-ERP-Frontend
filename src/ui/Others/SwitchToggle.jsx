import cn from '@/lib/cn';

const SwitchToggle = ({ className, ...props }) => {
	return (
		<input
			type='checkbox'
			className={cn(
				'toggle toggle-md checked:toggle-accent disabled:opacity-30',
				className
			)}
			{...props}
		/>
	);
};

export default SwitchToggle;
