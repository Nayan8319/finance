import React from "react";
import Home from "./Pages/home";
import ProductsDemo from "./Pages/product_managment";
import User from "./Pages/Manage_Users";
import Transactions from "./Pages/Transaction";
import Sales from "./Pages/Sales_report";
import Purchase from "./Pages/Purchase_report";
import AddSale from "./Pages/add_sale";
import Footer from "./Pages/HomeInners/footer";
import NewPurchase from "./Pages/New_purchase";

function Main(props){

    return (
        <>
            <div id="main-content" className="h-max w-full bg-gray-100 relative overflow-y-auto lg:ml-64 p-2">
            <main>
                <div className="bg-white p-4 border-solid sm:p-0 border-2 rounded-lg">
                    <div className="sm:px-0 md:px-4 lg:px-4 py-3">

                        {
                            (props.tab === "Dashboard")
                            ? <Home/>                                    
                            : (props.tab === "Product Managment") 
                            ? <ProductsDemo/>
                            : (props.tab === "Manage Users") 
                            ? <User/>
                            :  (props.tab === "Transactions") 
                            ? <Transactions/>
                            : (props.tab === "Sales report") 
                            ? <Sales/>
                            : (props.tab === "Purchase report") 
                            ? <Purchase/>
                            : (props.tab === "New Purchase") 
                            ? <NewPurchase/>
                            : (props.tab === "Add Sale") 
                            ? <AddSale/>
                            : "page under cunstraction"
                        }

                    </div>
                </div>
            </main>
       <Footer/>
       </div>
        </>
    )
}

export default Main;