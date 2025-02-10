from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# MongoDB configurations
MONGODB_URI = "mongodb://localhost:27017/"  # Change this to your MongoDB URI
DB_NAME = "finance"
# COLLECTION_NAME = "loginData"

# Create a MongoDB client
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
loginData = db["loginData"]
productCollection = db['productData']
counterCollection = db['counterData']
transactionData = db['transactionData']
salesData = db["salesData"]
purchaseData = db["purchaseData"]

@app.route('/api',methods=['POST'])
def index():
    data = request.json
    email = data.get('Email')
    password = data.get('Pass')

    document = loginData.find_one({'email': email, 'password': password})

    if document:
        isAdmin = document.get('isAdmin', False)
        if document.get("status") == "Active" :
            return jsonify({'loggedIn': True, 'message':"Logged In successfully !!" ,'isAdmin': isAdmin})
        else :
            return jsonify({'loggedIn': False, 'message':"Not allowed to login !!" })
    else:
        return jsonify({'loggedIn': False, 'message':"Incorrect Email or password !!"})
    
@app.route('/api/isAdmin', methods=['POST'])
def isAdmin():
    data = request.json
    email = data.get('Email')
    document = loginData.find_one({'email': email})

    if document:
        isAdmin = document.get('isAdmin', False)
        return jsonify({'message': True ,'isAdmin': isAdmin})
    else:
        return jsonify({'message': False})
    
@app.route("/api/permission",methods=['POST'])
def permission():
    data = request.json
    email = data.get('Email')
    document = loginData.find_one({'email':email})

    if document:
        permissions = document.get('permission','')
        return jsonify({"permissions" : permissions})
    else:
        permissions = ""
        return jsonify({"permissions" : permissions})

#Get all products
@app.route("/api/getProducts",methods = ['POST'])
def getProducts():
    data = request.json
    document = list(productCollection.find({},{"_id":0}))
    return jsonify(document)
    
# insert Product
@app.route('/api/insertProduct', methods=['POST'])
def insert_document():
    try:
        inserted_from = ""
        data = request.json  # Get JSON data from the request

        counter = counterCollection.find_one({},{"_id":0})
        deleteIds = sorted(counter.get("productDeleteId",[]))
        increaseId = counter.get("productIdToIncrease","")
        deleteIdsLength = len(deleteIds)

        if (deleteIdsLength > 0):
            data["id"] = deleteIds[0]
            inserted_from = "delete_id"
        else:
            inserted_from = "increament_id"
            data["id"] = int(increaseId)

        product = productCollection.find_one({"name":data.get("name")})

        if product :
            return jsonify({"message": "Product already exist !!","isInserted":False})
        else:
            inserted_id = productCollection.insert_one(data).inserted_id
            if inserted_id:
                if inserted_from == "delete_id":
                    counterCollection.update_many({}, {"$pop": {"productDeleteId": -1} })
                elif inserted_from == "increament_id":
                    counterCollection.update_many({}, { "$inc": { "productIdToIncrease": 1 } })

            return jsonify({"message": "Product added successfully", "inserted_id": str(inserted_id) , "isInserted":True})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete Product
@app.route('/api/deleteProduct',methods=['POST'])
def deleteProduct():
    data = request.json
    deleted_id = data.get("id")
    isDeleted = False
    isExist = False

    #Check that product is exist or not
    doc = productCollection.find_one({"id":deleted_id})
    if doc :
        isExist = True
    else :
        return jsonify({"message":"Product not found !!","isDeleted":False})

    #Check that product deleted or not
    if isExist:
        if( productCollection.delete_one( {"id":data.get("id")} ) ):
            isDeleted = True
        else:
            return jsonify({"message":"Unable to Delete Product !!","isDeleted":False})

    #if product deleted add deleted_id to deleted IDs (counter)
    if (isDeleted):
        if(counterCollection.update_one({},{"$push":{f"productDeleteId":deleted_id}})):
            return jsonify({"message":"Product deleted Successfully","isDeleted" : True, "Exist": isExist})
        else:
            return jsonify({"message":"Product Deleted with some error !","isDeleted":False})
        
# Update Product
@app.route('/api/updateProduct',methods=['POST'])
def updateProduct():
    data = request.json
    id = data.get("id")
    doc = productCollection.find_one({"id":id},{"_id":0})

    if doc :
        if (doc.get('name') == data.get('name') and
            doc.get('category') == data.get('category') and 
            doc.get('price') == data.get('price') and 
            doc.get('quantity') == data.get('quantity') and 
            doc.get('inventoryStatus') == data.get('inventoryStatus')):

            return jsonify({"message":"No data is changed !","isUpdated":False})
        else:
            new_name = data.get('name')
            new_category = data.get('category')
            new_price = data.get('price')
            new_quantity = data.get('quantity')
            new_inventoryStatus = data.get('inventoryStatus')

            isUpdated = productCollection.update_one({"id":id},{"$set":{
                "name":new_name,
                "category":new_category,
                "price":new_price,
                "quantity":new_quantity,
                "inventoryStatus":new_inventoryStatus
            }})

            if isUpdated:
                return jsonify({"message":"Product Updated Successfully !","isUpdated":True})
            else:
                return jsonify({"message":"Update Failed !","isUpdated":False})
    else:
        return jsonify({"message":"Product not found !","isUpdated":False})

# Delete Multiple Products
@app.route("/api/deleteMultipleProducts",methods=['POST'])
def deleteMultipleProduct():
    data = request.json
    IDs_to_delete = []
    isDeleted = False

    # Store all id in variable
    for x in data:
        IDs_to_delete.append(int(x.get("id")))

    for x in IDs_to_delete:
        if (x == IDs_to_delete[0]):
            doc = productCollection.find_one({"id":x},{"_id":0})
            if doc:
                if (productCollection.delete_one({"id":x})):
                    if(counterCollection.update_one({},{"$push":{f"productDeleteId":x}})):
                        isDeleted = True
            else:
                return jsonify({"message":"Product not found !!","isAllDeleted":False})
        else:
            if(isDeleted):
                if (productCollection.delete_one({"id":x})):
                    if(counterCollection.update_one({},{"$push":{f"productDeleteId":x}})):
                            isDeleted = True
            else:
                return jsonify({"message":"Unable to delete some products !","isAllDeleted":False})
            
    return jsonify({"message":"Products Deleted Successfully !!","isAllDeleted":True})

# Get ALL users 
@app.route("/api/getAllUsers",methods = ['POST'])
def get_all_users():
    data = request.json
    doc = list(loginData.find({},{"_id":0}))
    return jsonify(doc);

# Insert User
@app.route('/api/insertUser', methods=['POST'])
def insert_user():
    try:
        data = request.json  # Get JSON data from the request

        counter = counterCollection.find_one({},{"_id":0})
        increaseId = counter.get("userIdToIncrease","")
        data["id"] = int(increaseId)

        #if admin than remove permissions
        if(data.get("isAdmin")):
            if "permissions" in data:
                data.pop("permissions");
        else:
            if not "permissions" in data :
                data["permissions"] = []

        ## to check user already exist or not 
        user = loginData.find_one({"name":data.get("name"),"email":data.get("email")})

        if user :
            return jsonify({"message": "User already exist !!","isInserted":False})
        else:
            inserted_id = loginData.insert_one(data).inserted_id
            if inserted_id:
                counterCollection.update_many({}, { "$inc": { "userIdToIncrease": 1 } })
                return jsonify({"message": "User added successfully", "inserted_id": str(inserted_id) , "isInserted":True})
            else:
                return jsonify({"message": "Unable to add the user !! try Again ..", "isInserted": False})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Update User
@app.route('/api/updateUser',methods = ['POST'])
def update_user():
    data = request.json
    id = data.get("id")
    doc = loginData.find_one({"id":id},{"_id":0})
    isUpdated = False

    new_permission = [];

    if doc :
        if (doc.get('name') == data.get('name') and
            doc.get('email') == data.get('email') and 
            doc.get('permission') == data.get('permission') and 
            doc.get('isAdmin') == data.get('isAdmin')):

            return jsonify({"message":"No data is changed !","isUpdated":False})
        else:
            new_name = data.get('name')
            new_email = data.get('email')
            new_isAdmin = data.get('isAdmin')
            #if not Admin get permissions
            if data.get('isAdmin') == False :
                new_permission = data.get('permission')
                isUpdated = loginData.update_one({"id":id},{"$set":{
                    "name":new_name,
                    "email":new_email,
                    "permission":new_permission,
                    "isAdmin":new_isAdmin
                }})
            else:
                isUpdated = loginData.update_one({"id":id},{"$set":{
                    "name":new_name,
                    "email":new_email,
                    "isAdmin":new_isAdmin
                }})

            if isUpdated:
                return jsonify({"message":"User Updated Successfully !","isUpdated":True})
            else:
                return jsonify({"message":"Update Failed !","isUpdated":False})
    else:
        return jsonify({"message":"User not found !","isUpdated":False})

# Change User status
@app.route('/api/changeStatusOfUser',methods=['POST'])
def change_status_of_user():
    data = request.json
    id = data.get("id")
    doc = loginData.find_one({"id":id},{"_id":0})
    isUpdated = False

    if doc :
        isUpdated = loginData.update_one({"id":id},{"$set":{
            "status":data.get("status")
        }})
    else:
        return jsonify({"message":"User not found !","isUpdated":False})

    if isUpdated:
        return jsonify({"message":"Status Updated !!","isUpdated":True})
    else:
        return jsonify({"message":"Update Failed !","isUpdated":False})

@app.route("/api/getTransactions" , methods = ['POST'])
def getTransactions():
    data = request.json
    doc = list(transactionData.find({},{"_id":0}))
    return jsonify(doc)

@app.route("/api/getSales" , methods = ['POST'])
def getSales():
    data = request.json
    doc = list(salesData.find({},{"_id":0}))
    return jsonify(doc)

@app.route("/api/getPurchase" , methods = ['POST'])
def getPurchase():
    data = request.json
    doc = list(purchaseData.find({},{"_id":0}))
    return jsonify(doc)

@app.route("/api/addSale",methods=['POST'])
def addSale():
    data = request.json
    newTransactionId = 0
    
    counter = counterCollection.find_one({},{"_id":0})
    newTransactionId = counter.get("transactionIdToIncrease");
    current_datetime = datetime.datetime.now()

    # return jsonify(data['customer_name']);
    sale_data = {
        "transaction_id":newTransactionId,
        "customer_name" : data.get("customer_name"),
        "item":data.get("item"),
        "quantity":data.get("quantity"),
        "date":current_datetime,
        "total_amount":data.get("total_amount")
    }

    trasaction_data = {
        "transaction_id":newTransactionId,
        "type" :"sale",
        "item" : data.get("item"),
        "quantity" :data.get("quantity"),
        "date":current_datetime,
        "total_amount":data.get("total_amount")
    }

    if(salesData.insert_one(sale_data)):
        if(transactionData.insert_one(trasaction_data)):
            productCollection.update_one({"name":data.get('item')} ,{"$inc":{"quantity":-( int(data.get('quantity') )) }})
            counterCollection.update_many({}, { "$inc": { "transactionIdToIncrease": 1 } })
            return jsonify({"message":"Sale added !!","isInserted":True})        
    else:
        return jsonify({"message":"Failed to add sale !!","isInserted":False})

@app.route("/api/addPurchase",methods = ['POST'])
def addPurchase():
    data = request.json
    newTransactionId = 0
    
    counter = counterCollection.find_one({},{"_id":0})
    newTransactionId = counter.get("transactionIdToIncrease");
    current_datetime = datetime.datetime.now()

    purchase_data = {
        "transaction_id":newTransactionId,
        "vendor_name" : data.get("vendor_name"),
        "item":data.get("item"),
        "price" : data.get("price"),
        "quantity":data.get("quantity"),
        "date":current_datetime,
        "total_amount":data.get("total_amount")
    }

    trasaction_data = {
        "transaction_id":newTransactionId,
        "type" :"purchase",
        "item" : data.get("item"),
        "quantity" :data.get("quantity"),
        "date":current_datetime,
        "total_amount":data.get("total_amount")
    }

    if(purchaseData.insert_one(purchase_data)):
        if(transactionData.insert_one(trasaction_data)):
            counterCollection.update_many({}, { "$inc": { "transactionIdToIncrease": 1 } })
            return jsonify({"message":"Purchased success !!","isInserted":True})        
    else:
        return jsonify({"message":"Failed to purchase !!","isInserted":False})

if __name__ == '__main__':
    app.run(debug=True)


