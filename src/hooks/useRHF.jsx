import { yupResolver } from '@hookform/resolvers/yup';
import {
	Controller,
	useController,
	useFieldArray,
	useForm,
} from 'react-hook-form';
import { object } from 'yup';

export default function useRHF(schema = {}, defaultValues = {}) {
	const form = useForm({
		resolver: yupResolver(object(schema)),
		defaultValues,
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
		getValues,
		setValue,
		watch,
		trigger,
		unregister,
		getFieldState,
	} = form;

	return {
		Controller,
		control,
		errors,
		getValues,
		handleSubmit,
		watch,
		reset,
		register,
		setValue,
		trigger,
		unregister,
		useController,
		useFieldArray,
		getFieldState,
		context: form,
	};
}
