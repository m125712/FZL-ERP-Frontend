import { format } from 'date-fns';

const GetDateTime = () => format(Date.now(), 'yyyy-MM-dd HH:mm:ss');

export default GetDateTime;
