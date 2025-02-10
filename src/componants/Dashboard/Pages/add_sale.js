import React, { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { getProducts } from '../../../javaScript/functions';
import { classNames } from 'primereact/utils';
import { toast } from 'react-toastify';
import { addSale } from '../../../javaScript/functions';
        
let emptySale = {
    // "transaction_id": '',
    "customer_name":'',
    "item" : [
        {"value" : "iPhone" ,"price" : 50000 , "quantity" : 150},
        {"value" : "XYS" ,"price" : 50000 , "quantity" : 150},
        {"value" : "ABC" ,"price" : 50000 , "quantity" : 150},
        {"value" : "ss" ,"price" : 50000 , "quantity" : 150}
    ],
    "quantity":  '',
    "date":'',
    "total_amount": ""
}

export default function AddSale() {

    // const [sale,setSale] = useState(emptySale);
    const [products,setProducts] = useState([]);
    const [customer_name , setCustomer_name] = useState('');
    const [selectedItem,setSelectedItem ] = useState({});
    const [quantity,setQuantity ] = useState(emptySale.quantity);
    const [submitted , setSubmitted ] = useState(false);


    useEffect(()=>{
        getProducts((e)=>{
            let new_products = [];
            for(let i=0 ; i<e.length ; i++){
                if(e[i].inventoryStatus !== "OUTOFSTOCK"){
                     let data = {
                        "value" : e[i].name,
                        "price" : e[i].price,
                        "quantity" : e[i].quantity
                     }
                     new_products.push(data);
                }
            }
            setProducts(new_products);
        });
    },[]);

    const handleQuantity = (e) => {
        setSubmitted(false);
        setQuantity(e.value);
    };

    const handleSelectedItem = (e) => {
        for (let i=0 ; i < products.length ; i++){
            if (products[i].value === e.value){
                setSelectedItem(products[i]);
                break;
            }
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        let isValidQuantity = !((quantity > selectedItem.quantity) || (submitted && quantity === '') || quantity === 0);
        let isValidProduct = (Object.keys(selectedItem).length !== 0);
        let isValidCustomerName = !!customer_name.trim();
        let isAllValid = (isValidCustomerName && isValidProduct && isValidQuantity);

        if(isAllValid){
            let data = {
                "customer_name" : customer_name,
                "item" : selectedItem.value,
                "total_amount" : selectedItem.price * quantity,
                "quantity":quantity
            };
            addSale(data ,(e)=>{
                if(e.isInserted){
                    toast.success(e.message);
                }else{
                    toast.warn(e.message);
                }
            });
        }
    };

  return (
    <form className='sm:p-2 h-max'>
        {/* Customer Name */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="customer_name" className="font-bold">
                Customer Name
            </label>
            <InputText 
             id="customer_name" 
             value={customer_name} 
             className={classNames({"p-invalid": submitted && !customer_name.trim()},"w-full")}
             placeholder='John Duo'
             onChange={(e)=>setCustomer_name(e.target.value)}
            />

            {submitted && !customer_name.trim() && <span className='p-error'> Customer name is required </span>}
        </div>

        {/* Products to select */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="item" className="font-bold">
                Product
            </label>
            <Dropdown 
             id="item" 
             value={selectedItem.value} 
             onChange={handleSelectedItem} 
             options={products} 
             optionLabel="value" 
             optionValue="value"
             placeholder="Select a product" 
             className={classNames({'p-invalid':(submitted && (Object.keys(selectedItem).length === 0))})}
            />
            {submitted && (Object.keys(selectedItem).length === 0) && <span className='p-error'> No product selected </span>}            
        </div>

        {/* Quantity */}
        <div className="field mb-2 flex justify-center flex-col">
              <label htmlFor="quantity" className="font-bold"> Product quantity</label>
              <InputNumber 
                id="quantity" 
                value={quantity} 
                className={classNames({'p-invalid': (quantity > selectedItem.quantity) || (submitted && quantity === '') || (quantity === 0) } , 'w-full')} 
                onChange={handleQuantity} />

              { (quantity > selectedItem.quantity)  && <span className='p-error'> Only {selectedItem.quantity} quantity is avilable.</span>} 
              { (submitted && (quantity === '' || quantity === 0) && <span className='p-error'> Quantity is required.</span>)}
        </div>

        {/* Amount */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="total_amount" className="font-bold">
                Amount
            </label>
            <InputNumber 
              id="total_amount" 
              value={(selectedItem.value)?selectedItem.price * quantity:0} 
              disabled 
              className='w-full'
              mode="currency" currency="INR" 
              locale="en-IN"/>
        </div>

        {/* Submit */}
        <Button type='button' label='Add New Sale' onClick={handleSubmit} />
    </form>
  )
}
