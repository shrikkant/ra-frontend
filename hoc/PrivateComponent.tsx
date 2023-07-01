import {selectAuthState} from '../app-store/auth/auth.slice';
import {useSelector} from 'react-redux';
import { IUser } from '../app-store/types';
import {sessionData} from '../app-store/session/session.slice';
import { useRouter } from 'next/router';

const PrivateComponent:React.FC<{component: React.FC }> = ({component: C}):JSX.Element => {
    const router = useRouter();
    const loggedUser: IUser = useSelector(selectAuthState) || {} as IUser;
    const session = useSelector(sessionData);

    if(!session.isSessionValid || !loggedUser.id) {
        router.push('/signin');
    }

    return <C/>
}
export default PrivateComponent;
