
import {memo , React} from 'react';
import { ToastContainer } from 'react-toastify';
import Dashboard from './dashboard';
// import { addUser, get_all_users } from '../javaScript/functions';

function App() {

    return (
        <>
            <ToastContainer autoClose={2000} limit={2} pauseOnHover={false}/>
            <Dashboard/>
        </>
    );
}

export default memo(App);