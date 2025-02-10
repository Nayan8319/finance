import React, { useState, useEffect , useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Toolbar } from 'primereact/toolbar';
import { getTransactions } from '../../../javaScript/functions';

export default function Transactions() {
    const dt = useRef(null);
    const [transactions, setTransactions] = useState([]);

    const fetchPermissionsAndPerformWork = async () => {
        try {
            const response = await new Promise((resolve, reject) => {
                getTransactions((e) => resolve(e));
            });
            setTransactions(response);
        } catch (error) {
            console.error("Error getting permissions:", error);
        }
    };
    
    useEffect(() => {
        fetchPermissionsAndPerformWork();
        const intervalId = setInterval(fetchPermissionsAndPerformWork, 5000);
        return () => clearInterval(intervalId);
    },[]);

    const rightToolbarTemplate = () => {
        return (
        <Button title="EXPORT" className="p-button-help" onClick={()=> dt.current.exportCSV()}>
            <FontAwesomeIcon icon={faUpload} />
        </Button> 
        );
    };

    return (
        <div className="card">

            <Toolbar className="mb-4" id="toolbar" start={<p className='font-medium text-xl'>Transactions Data </p>} end={rightToolbarTemplate}></Toolbar>
            <DataTable ref={dt} value={transactions} showGridlines tableStyle={{ minWidth: '50rem' }}
                paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Transactions" 
            >
                <Column sortable field="transaction_id" header="ID"></Column>
                <Column sortable field="item" header="Product Name"></Column>
                <Column sortable field="date" header="Transaction Date" dataType={Date}></Column>
                <Column sortable field="quantity" header="Quantity"></Column>
                <Column sortable field="type" header="Type"></Column>
                <Column sortable field="total_amount" header="Amount"></Column>
            </DataTable>
        </div>
    );
}