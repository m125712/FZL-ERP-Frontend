import cn from '@/lib/cn';

const SubmitButton = ({ className, text = 'Save' }) => {
	return (
		<button
			type='submit'
			className={cn('text-md btn btn-primary btn-block', className)}>
			{text}
		</button>
	);
};

export default SubmitButton;
