import { ErrorMessage } from '@hookform/error-message';
import { ChevronDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

// Custom renderer Component
const CustomRenderer = (props) => {
	const {
		watch,
		formState: { errors, isSubmitting, isValidating },
	} = useFormContext();

	if (props.field.isLoading) {
		return <Skeleton className='h-6 w-full' />;
	}

	return (
		<div className='bg-gradient'>
			{props.field.type === 'custom' && (
				<div className='flex h-full min-h-6 items-center bg-transparent px-2'>
					{props.field.component(props.row || 0)}
				</div>
			)}
			{props.field.type === 'select' && (
				<div className='bg-gradient flex h-full min-h-6 justify-between bg-transparent px-3 py-2 text-sm'>
					{
						props.field.options.find(
							(option) =>
								option.value ===
								watch(props?.fieldName)?.[props?.row]?.[
									props?.field?.accessorKey
								]
						)?.label
					}
					<ChevronDown className='size-5 text-secondary/50' />
				</div>
			)}

			{(props.field.type === 'text' || props.field.type === 'number') && (
				<div
					className={cn(
						'bg-gradient block h-full min-h-6 w-full px-3 py-2 text-sm font-normal text-foreground'
					)}
				>
					{watch(
						`${props.fieldName}.${props.row}.${props.field.accessorKey}`
					)}
				</div>
			)}
			<ErrorMessage
				errors={errors}
				name={`${props.fieldName}.${props.row}.${props.field.accessorKey}`}
				render={({ message }) => (
					<p className='pb-2 pl-3 text-sm font-medium text-destructive'>
						{message}
					</p>
				)}
			/>
		</div>
	);
};

export default CustomRenderer;
