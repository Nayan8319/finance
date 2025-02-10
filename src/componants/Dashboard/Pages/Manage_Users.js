

// .
// .
// .
// .
//  Page under contruction : Admin - Manage Users
// .
// .
// .
// .


//Main react Import
import React, { useState, useEffect, useRef } from 'react';

//Prime React imports
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';

//My imports
import { toast } from 'react-toastify';
import { addUser, get_all_users, updateUser ,changeStatus } from '../../../javaScript/functions';
// import { deleteProduct as dp } from '../../../javaScript/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPencil, faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons';
// import { account_request_email } from '../../../javaScript/email';

export default function User() {

    //Empty user to avoid errors
    let emptyUser = {
        // id: null,
        name : "",
        email : "",
        permission : [],
        password : "",
        status : "Active",
        isAdmin : false
    };
    
    const [users, setUsers] = useState();
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    //Change user data when CRUD done
    const changeUsers = () => {
        get_all_users("",(data)=>{
            let new_data = data.sort((a, b) => a.id - b.id);
            setUsers(new_data);
        });
    };

    //Add users in data table on load
    useEffect(()=>{
        changeUsers();
    },[]);

    //Show insert or update dialog
    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    //Hide insert or update dialog
    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    //Hide delete multiple Dialog
    const hideDeleteProductDialog = () => {
        setDeleteUserDialog(false);
    };

    //Add or Update user
    const saveUser = () => {
        setSubmitted(true);


        if (user.name.trim() && user.email.trim() && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(user.email)) {
            let _user = {...user};

            // for update
            if (_user.id) {
                if(_user.isAdmin){
                    delete _user.permission;
                }

                updateUser(_user , (e)=>{
                    if(e.isUpdated){
                        changeUsers();
                        toast.success(e.message);
                    }else if(!e.isUpdated){
                        toast.warn(e.message);
                    }else{
                        console.log(e);
                        toast.error("Something went wrong");
                    }
                });
            } 
            //for insert
            else {
                if(_user.isAdmin){
                    delete _user.permission;
                }

                addUser(_user,(e)=>{
                    console.log(e);
                    if(e.isInserted){
                        changeUsers();
                        toast.success(e.message);
                    }else if(!e.isInserted){
                        toast.warning(e.message);
                    }else{
                        toast.error(e.message);
                    }
                });
            }

            setTimeout(()=>{
                setUserDialog(false);
                setTimeout(()=>{
                    setUser(emptyUser);   
                },200);
            },500);
        }
    };

    //Edit user dailog show
    const editUser = (user) => {
        let _user = {...user};

        if(_user.isAdmin){
            _user["permission"] = [];
        }

        setUser(_user);
        setUserDialog(true);
    };

    //Confirm to delete single user
    const changeActiveInactive = (user) => {
        if(user.isAdmin){
            user["permission"] = [];
        }
        setUser(user);
        setDeleteUserDialog(true);
    };

    //Delete single user
    const deleteProduct = () => {
        let _user = {...user};
        // let isActived = false ;

        if(_user.status === "Active"){
            _user["status"] = "Inactive";
        }else{
            _user["status"] = "Active";
            // isActived = true;
        }

        changeStatus(_user,(e)=>{
            // console.log(e);

            if(e.isUpdated){
                // if(isActived){
                //     let message = `${_user.name} your account is now activated and you can login to our website with email:${user.email} and password:${_user.password}. Thank you `;
                //     account_request_email(_user.email ,message);
                // }
                changeUsers();                
                toast.success(e.message);
            }else if(!e.isUpdated){
                toast.warn(e.message);
            }else{
                toast.error(e.message);
            }
        });

        
        setDeleteUserDialog(false);
        setUser(emptyUser);
    };

    //Export datatable's data that currantly showing in Excel
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    //Handle permission check box on dialog
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
    
    //On changing of Admin or User
    const onRoleChange = (e) => {
        let _user = {...user};

        _user.isAdmin = !_user.isAdmin ;
        setUser(_user);
    };

    //password mask
    const getPassword = (e) => {
        // console.log(e);
        let password_aaray = e.password.split(""); 
        let value_toShow = "";
        for (let index = 0; index < password_aaray.length; index++) {
            value_toShow = value_toShow + "*";            
        }
        return value_toShow;
    }

    //to handle input value of text
    const onInputChange = (e, name) => {
        // setSubmitted(false);
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
    };

    //New and Delete multiple button
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button title="Add New" severity="success" onClick={openNew}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </div>
        );
    };

    //Export button
    const rightToolbarTemplate = () => {
        return (
        <Button title="EXPORT" className="p-button-help" onClick={exportCSV}>
            <FontAwesomeIcon icon={faUpload} />
        </Button> 
        );
    };

    //Admin or User Status Tag
    const adminOrUserBodyTemplete = (rowData) => {
        return <Tag value={(rowData.isAdmin)?"Admin":"User"} severity={getServity(rowData)}></Tag>;
    };

    const activeInactiveBodyTemplete = (rowData) => {
        return <Tag value={rowData.status} severity={getStatus(rowData)}></Tag>;
    };

    //Edit and Inactive/Active Button
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button rounded className="mr-2" onClick={() => editUser(rowData)}>
                    <FontAwesomeIcon icon={faPencil}/>
                </Button>

                <Button rounded 
                    severity={(rowData.status === "Active")?'danger':'warning'} 
                    onClick={() => changeActiveInactive(rowData)}
                    title={(rowData.status === "Active")?"Inactive":'Active'}>
                    <FontAwesomeIcon icon={ (rowData.status === "Active")?faXmark:faCheck}/>
                </Button>

            </React.Fragment>
        );
    };

    //To get Backgroud color for inventory status
    const getStatus = (user) => {
        if( user.status === "Active") {
            return "info"
        }else{
            return "danger"
        }
    };

    //To get Admin or User's Backgroud
    const getServity = (user) => {
        if( user.isAdmin) {
            return "success"
        }else{
            return "warning"
        }
    };

    //Set the Permission when edit or add dialog open
    const getPermissions = (rowData) => {    
        
        let x = {...rowData};
        if(x.isAdmin){
            return <Tag value="NA" rounded style={{backgroundColor: "#ada200"}} className='m-1 bg-gray-100'></Tag>
        }
        else{
            const data = [...x.permission];
            
            if (data.length > 0){
                return (
                    <>
                        {
                            data.map((e,index)=>{
                                return <Tag key={index} value={e} rounded style={{backgroundColor: "#c90cc3"}} className='m-1 bg-gray-100'></Tag>
                            })
                        }
                    </>
                );
            }
            return <Tag value="No permissions" rounded style={{backgroundColor: "#ada200"}} className='m-1 bg-gray-100'></Tag>
        }
    };

    //Header of ( manage User Title / Search button )
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h2 className="text-xl m-0">Manage Users</h2>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    
    //Insert or Update Product Footer
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );

    //Delete Product footer
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    
    // Main Content to be Render
    return (
        <div>
            {/* Datatable */}
            <div className="card">
                {/* Toolbar that have Delete , New and Export-import buttons  
                    -> start and end are designed spratly */}
                <Toolbar className="mb-4" id="toolbar" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={users} removableSort dataKey="id"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users" 
                    globalFilter={globalFilter} 
                    header={header} showGridlines>
                        
                    <Column align={'center'} field="id" header="ID" sortable style={{ minWidth: '2rem' }}></Column>
                    <Column align={'center'} field="name" header="Name" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column align={'center'} field="email" header="Email" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column align={'center'} field="status" header="Status" body={activeInactiveBodyTemplete} sortable style={{ minWidth: '6rem'}}></Column>
                    <Column align={'center'} header="Password" body={getPassword} style={{ minWidth: '6rem' }} exportable={false}></Column>
                    <Column field="permission" header="Permissions" body={getPermissions} style={{ minWidth: '8rem'}}></Column>
                    <Column align={'center'} field="isAdmin" header="Type" body={adminOrUserBodyTemplete} sortable style={{ minWidth: '5rem'}}></Column>
                    
                    {/* Edit end Delete buttons : Designed Sapratly */}
                    <Column align={'center'} header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem'}}></Column>
                </DataTable>
            </div>
                    
            {/* Insert Update Dialog */}
            <Dialog draggable={false} maximizable visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                
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
                    <label className="mb-3 font-bold">Admin or Company User</label>

                    <div className="formgrid grid mt-1">
                        
                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="isAdmin" value="Admin" name="isAdmin" onChange={onRoleChange} checked={user.isAdmin} />
                            <label htmlFor="isAdmin" className='ml-3'> Admin </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="report" value="user" name="isAdmin" onChange={onRoleChange} checked={!user.isAdmin} />
                            <label htmlFor="report" className='ml-3'> Company User </label>
                        </div>

                    </div>
                </div>

                {/* Permissions */}
                <div className="field mb-2">
                    <label className="mb-3 font-bold">Permissions</label>

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
                            <Checkbox disabled={(user.isAdmin)} inputId="sale" value="sale" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("sale")} />
                            <label htmlFor="sale" className='ml-3'> Sale </label>
                        </div>

                        <div className="field-radiobutton col-6 mb-2">
                            <Checkbox disabled={(user.isAdmin)} inputId="transaction" value="transaction" onChange={onPermissionChange} checked={!user.isAdmin && user.permission.includes("transaction")} />
                            <label htmlFor="transaction" className='ml-3'> Transaction </label>
                        </div>

                    </div>
                </div>
                
                {/* Password */}
                <div className="field mb-2">
                    <label htmlFor="password" className="font-bold"> Password </label>
                    <Password id="password" value={(user.id)?"*********":user.password} disabled={(user.id)} onChange={(e)=>{ if(!user.id){ onInputChange(e,"password")} }} required autoFocus />
                </div>
            </Dialog>

            {/* Active or inactive One user Dialog */}
            <Dialog draggable={false} visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && (
                        <span>
                            Are you sure you want to <b className='text-red-500'>{(user.status === "Active")?"Inactive":"Active"}</b> <b>{user.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            
        </div>
    );
}