
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
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

//My imports
import { toast } from 'react-toastify';
import { deleteMultipleProducts, getProducts , insertProduct , updateProduct } from '../../../javaScript/functions';
import { deleteProduct as dp } from '../../../javaScript/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

export default function Product() {

    //Empty product to avoid errors
    let emptyProduct = {
        // id: null,
        name: '',
        category: null,
        price: 0,
        quantity: 0,
        inventoryStatus: ''
    };

    //State to be used
    const [products, setProducts] = useState();
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    //Change product data when CRUD done
    const changeProducts = () => {
        getProducts((data)=>{
            let new_data = data.sort((a, b) => a.id - b.id);
            setProducts(new_data);
        });
    };

    //Add products in data table on load
    useEffect(()=>{
        changeProducts();
    },[]);

    //Format currency
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
    };

    //Show insert or update dialog
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    //Hide insert or update dialog
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    //Hide delete multiple Dialog
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    //Hide delete Dialog
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    //Add or Update product
    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _product = {...product};
            _product.inventoryStatus = getInventoryStatus(_product.quantity);

            //for update
            if (product.id) {
                updateProduct(_product,(e)=>{
                    if(e.isUpdated){
                        changeProducts();
                        toast.success(e.message);
                    }else if(!e.isUpdated){
                        toast.warning(e.message);
                    }else{
                        toast.error(e.message);
                    }
                });
            } 
            //for insert
            else {
                _product.inventoryStatus = getInventoryStatus(_product.quantity);

                let addData = {
                    name: _product.name,
                    category: _product.category,
                    price: _product.price,
                    quantity: _product.quantity,
                    inventoryStatus: _product.inventoryStatus
                };

                insertProduct(addData, (e) => {
                    if(e.isInserted){
                        changeProducts();
                        toast.success("Product inserted successfully !!");
                    }else if(!e.isInserted){
                        toast.warn(e.message);
                    }else{
                        toast.error("Something went wrong !!");
                    }
                });
            }

            setTimeout(()=>{
                setProductDialog(false);
                setProduct(emptyProduct);   
            },500);
        }
    };

    //To get Inventory status according to Quantity
    const getInventoryStatus =(value) => {
        if(value === 0){
            return "OUTOFSTOCK";
        }else if(value > 0 && value <= 100){
            return "LOWSTOCK";
        }else if(value > 100){
            return "INSTOCK";
        }else{
            return null;
        }
    }

    //Edit product dailog show
    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    //Confirm to delete single product
    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    //Delete single product
    const deleteProduct = () => {
        dp(product,(e)=>{
            if(e.isDeleted){
                let _products = products.filter((val) => val.id !== product.id);
                setProducts(_products);
                toast.success(e.message);
            }else if(!e.isDeleted){
                toast.warn(e.message);
            }else{
                toast.error(e.message);
            }
        });

        
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
    };

    //Export datatable's data that currantly showing in Excel
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    //Confirm to delete selected products
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    //To delete Multiple products
    const deleteSelectedProducts = () => {
        let selected_products = products.filter((val) => selectedProducts.includes(val));
        let not_selected_products = products.filter((val) => !selectedProducts.includes(val));

        deleteMultipleProducts(selected_products ,(e)=>{
            if(e.isAllDeleted){
                setProducts(not_selected_products);
                toast.success(e.message);
            }else if(!e.isAllDeleted){
                toast.warn(e.message);
            }else{
                toast.error(e.message);
            }
        });
        
        

        setDeleteProductsDialog(false);
        setSelectedProducts(null);

    };

    //To change category in Dialog of Insert and Update
    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    //to handle input value of text
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    //to handle input value of number in price 
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    //New and Delete multiple button
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button title="Add New" severity="success" onClick={openNew}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
                <Button title="Delete Selected" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} >
                    <FontAwesomeIcon icon={faTrash}/>   
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

    //Currancy Setting Function
    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    //Inventory Status Tag
    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
    };

    //Edit and Delete Button
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button rounded className="mr-2" onClick={() => editProduct(rowData)}>
                    <FontAwesomeIcon icon={faPencil}/>
                </Button>
                <Button rounded severity="danger" onClick={() => confirmDeleteProduct(rowData)}>
                    <FontAwesomeIcon icon={faTrash}/>   
                </Button>
            </React.Fragment>
        );
    };

    //To get Backgroud color for inventory status
    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'info';
        }
    };

    //Header of ( manage Product Title / Search button )
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h2 className="text-xl m-0">Manage Products</h2>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    
    //Insert or Update Product Footer
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );

    //Delete Product footer
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    
    //Delete MultiProduct
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
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

                <DataTable ref={dt} showGridlines value={products} selection={selectedProducts} removableSort onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>

                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column align={'center'} field="id" header="ID" sortable style={{ minWidth: '2rem' }}></Column>
                    <Column align={'center'} field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column align={'center'} field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '6rem' }}></Column>
                    <Column align={'center'} field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column align={'center'} field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem'}}></Column>
                    
                    {/* Edit end Delete buttons : Designed Sapratly */}
                    <Column align={'center'} body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem'}}></Column>
                </DataTable>
            </div>
                    
            {/* Insert Update Dialog */}
            <Dialog draggable={false} maximizable visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {/* {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} */}
                <div className="field mb-2">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field mb-2">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6 mb-2 mt-2">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                            <label htmlFor="category1" className='ml-3'>Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2" className='ml-3'>Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3" className='ml-3'>Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4" className='ml-3'>Fitness</label>
                        </div>
                        <div className="field-radiobutton col-6 mb-2">
                            <RadioButton inputId="category5" name="category" value="Other" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category5" className='ml-3'>Others</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid mb-2">
                    <div className="field col mb-2">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="INR" locale="en-US" />
                    </div>
                    <div className="field col mb-2">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
            </Dialog>

            {/* Delete One product Dialog */}
            <Dialog draggable={false} visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            
            {/* Delete products Dialog */}
            <Dialog draggable={false} visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}