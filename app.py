from flask import Flask, jsonify, request,render_template
from pymongo import MongoClient
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)
# MongoDB connection (use 'portfolio' as the database name)
client = MongoClient("mongodb://localhost:27017/")
db = client.portfolio
stocks_collection = db.stocks

# Endpoint to get all stocks
@app.route("/")
def index():
    return render_template("index.html")

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    stocks = list(stocks_collection.find({}))
    for stock in stocks:
        stock['_id'] = str(stock['_id'])  #
    return jsonify(stocks)

# Endpoint to add a stock
@app.route('/api/stocks', methods=['POST'])
def add_stock():
    data = request.get_json()
    new_stock = {
        "name": data['name'],
        "quantity": data['quantity'],
        "price": data['price']
    }
    stocks_collection.insert_one(new_stock)
    return jsonify({"message": "Stock added successfully!"})

# Endpoint to get a single stock by ID
@app.route('/api/stocks/<stock_id>', methods=['GET'])
def get_stock(stock_id):
    stock = stocks_collection.find_one({"_id": ObjectId(stock_id)})
    if stock:
        stock['_id'] = str(stock['_id'])  # Convert ObjectId to string
        return jsonify(stock)
    else:
        return jsonify({"error": "Stock not found"}), 404


# Endpoint to update a stock
@app.route('/api/stocks/<stock_id>', methods=['PUT'])
def update_stock(stock_id):
    data = request.get_json()
    updated_stock = {
        "name": data['name'],
        "quantity": data['quantity'],
        "price": data['price']
    }
    stocks_collection.update_one({"_id": ObjectId(stock_id)}, {"$set": updated_stock})
    return jsonify({"message": "Stock updated successfully!"})

# Endpoint to delete a stock
@app.route('/api/stocks/<stock_id>', methods=['DELETE'])
def delete_stock(stock_id):
    stocks_collection.delete_one({"_id": ObjectId(stock_id)})
    return jsonify({"message": "Stock deleted successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
