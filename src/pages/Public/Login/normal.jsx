import { firstRoute } from '@/routes';
import { useAuth } from '@context/auth';
import { Navigate, redirect } from 'react-router';
import { useRHF } from '@/hooks';

import { Input, PasswordInput } from '@/ui';

import { LOGIN_NULL, LOGIN_SCHEMA } from '@/util/Schema';

export default function Index() {
	const { signed, Login } = useAuth();

	if (signed) return <Navigate to='/profile' replace />;

	const { register, handleSubmit, errors } = useRHF(LOGIN_SCHEMA, LOGIN_NULL);

	const onSubmit = async (data) => {
		const isLogin = await Login(data);
		if (isLogin) {
			redirect(firstRoute?.path, { replace: true });
		}
	};

	return (
		<div className='flex h-screen w-screen items-center justify-center'>
			<div className='flex w-full max-w-md flex-col justify-center bg-white shadow-lg backdrop-blur-sm'>
				<div className='flex min-h-[400px] flex-col rounded-lg border shadow-lg'>
					<div className='font-heading flex-wrap rounded-t-sm bg-primary py-4 text-center text-2xl font-semibold text-primary-content'>
						Fortune Zipper LTD
					</div>
					<div className='mt-8 flex flex-col px-4 text-center'>
						<span className='font-semibold text-primary'>
							Sign In
						</span>
						<span className='mt-2 text-sm text-gray-500'>
							Enter Your Email and password <br />
							to access the admin panel
						</span>
						<form
							onSubmit={handleSubmit(onSubmit)}
							noValidate
							method='dialog'
							className='flex flex-col space-y-4 py-4'
						>
							<Input
								label='email'
								type='email'
								{...{ register, errors }}
							/>
							<PasswordInput
								title='Password'
								label='pass'
								{...{ register, errors }}
							/>

							<div className='modal-action pt-4'>
								<button
									type='submit'
									className='btn btn-primary btn-block'
								>
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
