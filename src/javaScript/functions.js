export function isAdmin(email, callback) {
    const data = {
        Email: email
    };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/isAdmin', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.message) {
                    callback(response.isAdmin);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}

export function getPermissions(email,callback){
    const data = {
        Email: email
    };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/permission', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                
                if (response.permissions !== "") {
                    callback(response.permissions);
                } else {
                    callback("");
                }
            } else {
                callback("");
            }
        }
    };

    xhr.send(JSON.stringify(data));
}

export function getProducts(callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/getProducts', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } else {
                callback("");
            }
        }
    };

    xhr.send(JSON.stringify(""));
}

export function insertProduct(data,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/insertProduct', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("");
    };

    xhr.send(JSON.stringify(data));
}

export function addUser(data,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/insertUser', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Data : "+ JSON.stringify(data));
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("");
    };

    xhr.send(JSON.stringify(data));
}

export function deleteProduct(data,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/deleteProduct', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data));
}

export function updateProduct(data,callback){

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/updateProduct', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data));
}

export function deleteMultipleProducts(data,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/deleteMultipleProducts', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data));
}

export function get_all_users(data , callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/getAllUsers', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data));
}

export function updateUser(data , callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/updateUser', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data)); 
}

export function changeStatus( data , callback ){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/changeStatusOfUser', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data)); 
}


export function getTransactions(callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/getTransactions', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify({})); 
}

export function getSales(callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/getSales', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify({})); 
}

export function getPurchase(callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/getPurchase', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify({})); 
}

export function addSale(data,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/addSale', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data)); 
}

export function addPurchase(data,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/addPurchase', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(response);
            } 
        }
    };

    xhr.onerror = () => {
        callback("Error");
    };

    xhr.send(JSON.stringify(data)); 
}
/* async function ajax(method,url,data){
//     let xhr = new XMLHttpRequest();
//     xhr.open(method, url, true);
//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 const response = JSON.parse(xhr.responseText);
//                 console.log(response);
//                 return response;
//             }
//         }
//     };

//     xhr.onerror = () => {
//         return "Unable to get Get data"
//     };

//     xhr.send(JSON.stringify(data));
// }*/