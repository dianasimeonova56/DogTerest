from datetime import datetime
import json
from flask import Flask, jsonify, request, Response, send_from_directory
from storage import connect
from flask_cors import CORS

app = Flask("app")
CORS(app, 
     resources={
         r"/*": {"origins": "*",
                 "methods": ["GET", "POST", "PATCH", "PUT", "DELETE"]}
        }
    )

# @app.route("/", methods=["GET"])
# def home():
#     return send_from_directory('frontend', 'index.html')


@app.route("/version", methods=["GET"])
def version():
    response = {
        "version": "1.0.0",
        "requested_at": str(datetime.now())
    }
    return Response(json.dumps(response), content_type="application/json")

@app.route("/signin", methods=["GET", "POST"])
def signin():
    print("Request Data:", request.data)
    
    if request.content_type != 'application/json':
        return Response(json.dumps({"error": "Content-Type must be application/json"}), 
                        status=415,
                        headers={"Content-Type": "application/json"})
    
    body = request.json

    if not body or "email" not in body or "password" not in body:
        return Response(json.dumps({"error": "Invalid request."}), 
                        status=400, 
                        headers={"Content-Type": "application/json"})
    
    connection = connect()
    cursor = connection.cursor()
    try:
        query = """SELECT * FROM users WHERE email=?"""
        cursor.execute(query,(body["email"],))
        result = cursor.fetchone()
        user = {}
        user["user_id"] = result[0]
        user["first_name"] = result[1]
        user["last_name"] = result[2]
        user["email"] = result[3]
        user["password"] = result[4]
        user["created_at"] = result[5]
        user["updated_at"] = result[6]
        user["is_active"] = result[7]
        user["is_admin"] = result[8]
        print(user)
        if user["password"] == body["password"]:
            return Response(json.dumps({"data": {"id": user["user_id"], "first_name": user["first_name"], "is_admin": user["is_admin"]}}), 
                            status=200, 
                            headers={"Content-Type": "application/json"})
        else:
            return Response(json.dumps({"error": "Invalid email or password."}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})
    except Exception as e:
        print("Error:", e)
        return Response(json.dumps({"error": f"User not found. Cause: {e}"}), 
                        status=404, 
                        headers={"Content-Type": "application/json"})

@app.route("/signup", methods=["POST"])
def signup():
    body = request.json
    user = {
        "id": None,
        "first_name": body["firstname"],
        "last_name": body["lastname"],
        "email": body["email"],
        "password": body["password"],
        "is_active": 1,
        "is_admin": 0
    }
    connection = connect()
    cursor = connection.cursor()
    try:
        query = """SELECT * FROM users WHERE email = ?"""
        cursor.execute(query, (user["email"],))
        result = cursor.fetchone()
        if result:
            return Response(json.dumps({"error": "Email already exists"}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})
        print({"id": user["id"], "first_name": user["first_name"]})
        query = """
            INSERT INTO users (
            first_name, 
            last_name, 
            email,
            password,
            is_active,
            is_admin
        )
            VALUES (?, ?, ?, ?, ?, ?);
            """
        data = (
            user["first_name"],
            user["last_name"],
            user["email"],
            user["password"],
            user["is_active"],
            user["is_admin"]
        )
        cursor.execute(query, data)
        connection.commit()
        cursor.close()
        connection.close()
        response_data = {"id": user["id"], "first_name": user["first_name"]}
        return Response(json.dumps({"data": response_data}), 
                        status=200, 
                        headers={"Content-Type": "application/json"})
        
    except Exception as e:
        return Response(json.dumps({"error": f"Something went wrong. Cause: {e}"}), 
                        status=400,
                        headers={"Content-Type": "application/json"})
        
@app.route("/get_users", methods=["GET"])
def get_users():
    connection = connect()
    try:
        query = """SELECT * FROM users"""
        cursor = connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()

        # Transforming query result to JSON
        users = []
        for row in result:
            user = {
                "user_id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "email": row[3],
                "created_at": row[5],
                "updated_at": row[6],
                "is_active": row[7],
                "is_admin": row[8]
            }
            users.append(user)

        return jsonify({"users": users}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    
@app.route("/update_user", methods=["OPTIONS", "PATCH"])
def update_user():
    if request.method == "OPTIONS":
        # Handle preflight OPTIONS request (CORS)
        return Response(status=200, headers={
            "Access-Control-Allow-Origin": "*",  # Allow all origins
            "Access-Control-Allow-Methods": "PATCH, GET, POST, PUT, DELETE",  # Allow these HTTP methods
            "Access-Control-Allow-Headers": "Content-Type, Authorization"  # Allow necessary headers
        })
    
    if request.method == "PATCH":
        connection = connect()
        body = request.json
        print(body)
        try:
            query = """UPDATE users 
                SET first_name = ?, last_name = ?, email = ?, is_admin = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?"""
            cursor = connection.cursor()
            cursor.execute(query, (body["first_name"], body["last_name"], body["email"], body["is_admin"], body["user_id"],))
            connection.commit()
            return jsonify({"result": "User updated successfully"}),200
        except Exception as e:
            return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
            
@app.route("/delete_user", methods=["DELETE"])
def delete_user():
        connection = connect()
        print(request.data)
        body = request.get_json()
        user_id = body.get("user_id")
        try:
            query = """DELETE FROM users
                WHERE user_id = ?"""
            cursor = connection.cursor()
            cursor.execute(query, (user_id,))
            connection.commit()
            return jsonify({"result": "User deleted successfully"}),200
        except Exception as e:
            return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    
# def create_admin_user():
#     connection = connect()
#     cursor = connection.cursor()
#     try:
#         # query = """SELECT * FROM users WHERE is_admin = 1"""
#         # cursor.execute(query)
#         # result = cursor.fetchone()
#         # if result:
#         #     return Response(
#         #         json.dumps({"error": "Admin user already exists"}), 
#         #         status=400, 
#         #         headers={"Content-Type": "application/json"}
#         #     )

#         user = {
#             "id": None,
#             "first_name": "Admin",
#             "last_name": "User",
#             "email": "admin@example.com",
#             "password": "admin123",
#             "is_active": 1,
#             "is_admin": 1
#         }
#         query = """
#             INSERT INTO users (
#                 first_name, 
#                 last_name, 
#                 email,
#                 password,
#                 is_active,
#                 is_admin
#             )
#             VALUES (?,?,?,?,?,?);
#         """
#         cursor.execute(query, (
#             user["first_name"],
#             user["last_name"],
#             user["email"],
#             user["password"],
#             user["is_active"],
#             user["is_admin"]
#         ))
#         connection.commit()

#         return Response(
#             json.dumps({"message": "Admin user created successfully"}), 
#             status=201, 
#             headers={"Content-Type": "application/json"}
#         )
#     except Exception as e:
#         return Response(
#             json.dumps({"error": f"Something went wrong. Cause: {e}"}), 
#             status=400,
#             headers={"Content-Type": "application/json"}
#         )
#     finally:
#         cursor.close()
#         connection.close()

if __name__ == "__main__":
    #create_admin_user()
    app.run(debug=True, port=5001)
