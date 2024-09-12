import { useAuth } from '@/context/auth';
import cn from '@/lib/cn';
import { useNetworkState } from '@uidotdev/usehooks';

const User = ({ avatar = false }) => {
	const { user } = useAuth();
	const isOnline = useNetworkState().online;

	return (
		<div className='relative flex flex-1 flex-shrink-0 items-center gap-2'>
			{/* <span
				className={cn(
					'absolute right-0 top-0 text-xs',
					isOnline ? 'text-success' : 'text-error'
				)}>
				{isOnline ? 'Online' : 'Offline'}
			</span> */}
			{avatar && (
				<div className={cn('avatar', isOnline ? 'online' : 'offline')}>
					<div className='size-10 rounded-full'>
						<img
							className='object-cover'
							src='https://avatar.iran.liara.run/public/job/operator/male'
						/>
					</div>
				</div>
			)}

			<div className='flex flex-col items-start'>
				<span className='truncate capitalize'>{user?.name}</span>
				<span className='text-[.6rem] capitalize text-primary-content/70'>
					{user?.department}
				</span>
			</div>
		</div>
	);
};

export default User;
