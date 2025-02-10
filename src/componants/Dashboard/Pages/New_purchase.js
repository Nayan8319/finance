import React, { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { toast } from 'react-toastify';
import { addPurchase } from '../../../javaScript/functions';

export default function New_purchase() {

    // const [sale,setSale] = useState(emptySale);
    const [vendor_name , setVendor_name] = useState('');
    const [product,setProduct] = useState('');
    const [price,setPrice] = useState(0);
    const [quantity,setQuantity ] = useState(0);
    const [submitted , setSubmitted ] = useState(false);


    useEffect(()=>{
        
    },[]);

    const handleSubmit = () => {
        setSubmitted(true);
        let isValidQuantity = !(quantity <= 0);
        let isValidProduct = !!product.trim() ;
        let isValidVendorName = !!vendor_name.trim();
        let isValidPrice = price > 0;
        let isAllValid = (isValidProduct && isValidQuantity && isValidVendorName && isValidPrice) ;

        if(isAllValid){
            let data = {
                "vendor_name" : vendor_name,
                "item" : product,
                "price" : price ,
                "quantity" : quantity ,
                "total_amount" : price * quantity
            };

            addPurchase(data ,(e)=>{
                if(e.isInserted){
                    toast.success(e.message);
                }else{
                    toast.warning(e.message);
                }
            });

            setSubmitted(false);
        }
    };

  return (
    <form className='sm:p-2 h-max'>
        {/* Customer Name */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="vendor_name" className="font-bold">
                Vendor Name
            </label>
            <InputText 
             id="vendor_name" 
             value={vendor_name} 
             className={classNames({"p-invalid": submitted && !vendor_name.trim()},"w-full")}
             placeholder='John Duo'
             onChange={(e)=>setVendor_name(e.target.value)}
            />

            {submitted && !vendor_name.trim() && <span className='p-error'> Vendor name is required </span>}
        </div>

        {/* Product Name */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="product" className="font-bold">
                Product Name
            </label>
            <InputText 
             id="product" 
             value={product} 
             className={classNames({"p-invalid": submitted && !product.trim()},"w-full")}
             onChange={(e)=>setProduct(e.target.value)}
            />

            {submitted && !product.trim() && <span className='p-error'> Product name is required </span>}
        </div>

        {/* Quantity */}
        <div className="field mb-2 flex justify-center flex-col">
              <label htmlFor="quantity" className="font-bold"> Product quantity</label>
              <InputNumber 
                id="quantity" 
                value={quantity} 
                className={classNames({'p-invalid': (submitted && quantity <= 0) } , 'w-full')} 
                onChange={e => setQuantity(e.value)} />

              {(submitted && quantity <= 0 && <span className='p-error'> Quantity is required.</span>)}
        </div>

        {/* Amount */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="price" className="font-bold">
               Product Price
            </label>
            <InputNumber 
              id="price" 
              value={price} 
              onChange={e => setPrice(e.value)}
              className={classNames({"p-invalid": submitted && price <= 0})}
              mode="currency" currency="INR" 
              locale="en-IN"/>
              {(submitted && (price <= 0) && <span className='p-error'> Invalid price</span>)}
        </div>


        {/* Amount */}
        <div className="field mb-2 flex justify-center flex-col">
            <label htmlFor="total_amount" className="font-bold">
                Total Amount
            </label>
            <InputNumber 
              id="total_amount" 
              value={(price > 0)?price*quantity:0} 
              disabled 
              className='w-full mb-2'
              mode="currency" currency="INR" 
              locale="en-IN"/>
        </div>

        {/* Submit */}
        <Button type='button' label='Purchase' onClick={handleSubmit} />
    </form>
  )
}
