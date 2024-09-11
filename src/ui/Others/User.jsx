import { useAuth } from '@/context/auth';
import cn from '@/lib/cn';
import { useNetworkState } from '@uidotdev/usehooks';

const User = ({ avatar = false }) => {
	const { user } = useAuth();
	const isOnline = useNetworkState().online;

	return (
		<div className='flex flex-1 flex-shrink-0 items-center gap-2'>
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
