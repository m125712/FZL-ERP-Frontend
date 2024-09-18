import { useEffect } from 'react';
import { firstRoute } from '@/routes';
import { useAuth } from '@context/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { Input, PasswordInput } from '@/ui';

import { LOGIN_NULL, LOGIN_SCHEMA } from '@/util/Schema';

export default function Index() {
	const { Login, signed } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (signed === true) {
			navigate(firstRoute?.path, { replace: true });
		} else {
			navigate('/login', { replace: true });
		}
	}, [signed]);

	const { register, handleSubmit, errors } = useRHF(LOGIN_SCHEMA, LOGIN_NULL);

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			email: `${data?.email}@fortunezip.com`,
		};

		await Login(data);
	};

	return (
		<div className='flex min-h-screen min-w-max flex-col justify-center py-6 sm:py-12'>
			<div className='relative min-w-[40%] py-3 sm:mx-auto sm:max-w-xl'>
				<div className='absolute inset-0 -skew-y-6 transform animate-pulse bg-gradient-to-r from-primary to-primary/50 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl'></div>
				<div className='relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20'>
					<div className='mx-auto'>
						<span className='font-heading flex items-center justify-center text-2xl font-bold'>
							<span className='text-4xl text-primary'>
								Fortune Zipper LTD
							</span>
						</span>
						<form
							onSubmit={handleSubmit(onSubmit)}
							noValidate
							method='dialog'
							className='mx-auto mt-6 flex max-w-md flex-col space-y-6 sm:mt-10 sm:space-y-8'>
							<Input
								label='email'
								type='email'
								{...{ register, errors }}
							/>
							{/* <JoinInput
								label="email"
								type="email"
								unit="@fortunezip.com"
								{...{ register, errors }}
							/> */}
							<PasswordInput
								title='Password'
								label='pass'
								{...{ register, errors }}
							/>

							<div className='modal-action'>
								<button
									type='submit'
									className='btn btn-primary btn-block'>
									Login
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
