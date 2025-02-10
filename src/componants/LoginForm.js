import React, { useState } from 'react';
import "../css/loginForm.css";
import Dashboard from './dashboard.js';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { addUser } from '../javaScript/functions';

const LoginForm = () => {

  /* For Rendering Dashboard/Login Page */
  const [isloggedIn, setIsLoggedIn] = useState(false || ((localStorage.getItem('loggedIn') === 'true') && (localStorage.getItem('email') !== "")));

  /* For Handling Form */ 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const empty_user = {
    // id: null,
    name : "",
    email : "",
    permission : [],
    password : "",
    status : "Inactive",
    isAdmin : false
  };
  const [ requestDialog,setRequestDialog] = useState(false);
  const [submitted , setSubmitted] = useState(false);
  const [user ,setUser] = useState(empty_user);
  

  const userDialogFooter = (
      <React.Fragment>
          <Button label="Cancel" icon="pi pi-times" outlined onClick={ ()=> setRequestDialog(false) } />
          <Button label="Save" icon="pi pi-check" onClick={handleRequest} />
      </React.Fragment>
  );

  function handleRequest (e) {
    setSubmitted(true);
    if(user.email.trim() && user.name.trim() && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user.email)){
      alert ("Request has sent , you will get mail about it soon !! thank you ..");
      addUser(user,(e)=>{});
      setRequestDialog(false);
    }
  }

  const onInputChange = (e, name) => {
      // setSubmitted(false);
      const val = (e.target && e.target.value) || '';
      let _user = { ...user };

      _user[`${name}`] = val;

      setUser(_user);
  };

  const onPermissionChange = (e) => {
    // Create a deep copy of the user object
    let _user = JSON.parse(JSON.stringify(user));

    if (e.checked) {
        _user["permission"].push(e.value);
    } else {
        _user["permission"] = _user["permission"].filter(per => per !== e.value);
    }

    setUser(_user);
  };

  const onRoleChange = (e) => {
      let _user = {...user};

      _user.isAdmin = !_user.isAdmin ;
      setUser(_user);
  };
  /* Text to show on Login Page */
  const introText = `Managing your finances has never been easier with our advanced and user-friendly Financial Accounting System. 
  Our login page serves as the gateway to a world of efficient financial management, enabling you to streamline your accounting 
  processes, monitor your transactions, and gain valuable insights into your financial health.`;

  /* Handling Login on Submiting Form */
  function handleLogin(e) {

    e.preventDefault();
    
    //Data to be sent
    const data = {
      Email: email,
      Pass: password
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setIsLoggedIn(response.loggedIn);

          if (response.loggedIn) {
            // Store email in local storage
            localStorage.setItem('email', email);
            localStorage.setItem('loggedIn', true);

          }else{
            toast.error(response.message, {
              toastId : "incorrect",
              position: toast.POSITION.TOP_RIGHT
            });
          }

        } else {
          console.log('Error:', xhr.statusText);
        }
      }
    };

    xhr.send(JSON.stringify(data));
    return false;
  }

  /* Rendring page as par logged in or not */
  if (!isloggedIn) {
    return (
      <>
        <div className="relative min-h-screen flex">
          <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
            <div className="sm:w-1/2 xl:w-3/6 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497091071254-cc9b2ba7c48a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80)' }}>
              <div className="absolute bg-gradient-to-b from-black-100 to-blue-500 opacity-50 inset-0 z-0"></div>
              <div className="w-full max-w-md z-10">
                <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">Welcome to our FAS login page!</div>
                <div className="sm:text-sm xl:text-md text-gray-200 font-normal"> {introText} </div>
              </div>
              <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
            <div className="md:flex md:items-center md:justify-center  sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
              <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                  <h2 className="mt-6 text-3xl font-bold text-gray-900">
                    Welcome Back!
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">Please sign in to your account</p>
                </div>
                
                <form className="mt-8 space-y-6">
                  <div className="relative">

                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">Email</label>
                    <input className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      type="text" placeholder="mail@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                  </div>
                  <div className="mt-8 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">Password</label>
                    <input className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                      type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="text-sm">
                      <a href="#nothing" className="text-indigo-400 hover:text-blue-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button type="submit"
                      className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                      onClick={(e) => handleLogin(e)}
                    >
                      Log In
                    </button>
                  </div>
                </form>
                <div className="flex justify-center items-center space-x-2">
                  <span className="h-px w-16 bg-gray-200"></span>
                  <span className="text-gray-300 font-normal">or</span>
                  <span className="h-px w-16 bg-gray-200"></span>
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-gray-300 font-normal">Don't have an account?</span>
                  <a href="#nothing" className="text-indigo-400 hover:text-blue-500" onClick={()=> {setSubmitted(false); setRequestDialog(true); setUser(empty_user);}}> Request For account </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Dialog */}
        <Dialog draggable={false} maximizable visible={requestDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={()=>setRequestDialog(false)}>
                
                {/* Name */}
                <div className="field mb-2">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && (!user.name || user.name.length > 8) })} />
                    {submitted && (!user.name || user.name.length > 8) && <small className="p-error">Name is required of 8 character max.</small>}
                </div>

                {/* Email */}
                <div className="field mb-2">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText id="email" keyfilter={'email'} value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user.email) })} />
                    {
                        submitted && 
                        /* Check that email is valid or not ? */
                        (!user.email || !(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user.email))) && 
                        <small className="p-error"> Enter Valid Email.</small>
                    }
                </div>
                
                {/* Is Admin or not */}
                <div className="field mb-2">
                    <label className="mb-3 font-bold"> Which account you want ? </label>

                    <div className="formgrid grid mt-1">
                        
                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="isAdmin" value="Admin" name="isAdmin" onChange={onRoleChange} checked={user.isAdmin} />
                            <label htmlFor="isAdmin" className='ml-3'> Admin </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="report" value="user" name="isAdmin" onChange={onRoleChange} checked={!user.isAdmin} />
                            <label htmlFor="report" className='ml-3'> User </label>
                        </div>

                    </div>
                </div>

                {/* Permissions */}
                <div className="field mb-2">
                    <label className="mb-3 font-bold">Permissions you need</label>

                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6 mb-2 mt-2">
                            <Checkbox disabled={(user.isAdmin)} inputId="product" value="product" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("product")} />
                            <label htmlFor="product" className='ml-3'> Product </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <Checkbox disabled={(user.isAdmin)} inputId="customer" value="customer" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("customer")} />
                            <label htmlFor="customer" className='ml-3'> Customer </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <Checkbox disabled={(user.isAdmin)} inputId="vendor" value="vendor" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("vendor")} />
                            <label htmlFor="vendor" className='ml-3'> Vendor </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <Checkbox disabled={(user.isAdmin)} inputId="transaction" value="transaction" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("transaction")} />
                            <label htmlFor="transaction" className='ml-3'> Transaction </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <Checkbox disabled={(user.isAdmin)} inputId="report" value="report" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("report")} />
                            <label htmlFor="report" className='ml-3'> Report </label>
                        </div>

                    </div>
                </div>
                
                {/* Password */}
                <div className="field mb-2">
                    <label htmlFor="password" className="font-bold"> Password </label>
                    <Password id="password" value={user.id} onChange={(e)=>{ onInputChange(e,"password")}} required autoFocus feedback={false} />
                </div>
            </Dialog>
      </>
    );
  } 
  else if (localStorage.getItem('loggedIn') === 'true' && localStorage.getItem('email') !== "") {
    return <Dashboard/>
  }

};

export default LoginForm;
