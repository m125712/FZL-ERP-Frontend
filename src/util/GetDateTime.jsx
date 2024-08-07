import { format } from "date-fns";

const GetDateTime = () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z");

export default GetDateTime;
