const Collapse = ({ title, defaultOpened = false, children }) => {
	return (
		<div className='collapse collapse-arrow rounded-md border border-primary/30'>
			<input type='checkbox' defaultChecked={defaultOpened} />
			<div className='collapse-title text-lg font-medium'>{title}</div>
			<div className='collapse-content'>{children}</div>
		</div>
	);
};

export default Collapse;
