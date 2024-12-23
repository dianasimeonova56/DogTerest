from datetime import datetime
import json
import os
from flask import Flask, jsonify, request, Response
from storage import connect
from flask_cors import CORS

app = Flask("app")
CORS(app, 
     resources={
         r"/*": {"origins": "*",
                 "methods": ["GET", "POST", "PATCH", "PUT", "DELETE"]}
        }
    )

FILE_STORAGE_PATH = "imgs"
if not os.path.exists(FILE_STORAGE_PATH):
    os.makedirs(FILE_STORAGE_PATH)

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

### USER ###
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
            # return Response(json.dumps({"data": {"id": user["user_id"], "first_name": user["first_name"], "is_admin": user["is_admin"]}}), 
            #                 status=200, 
            #                 headers={"Content-Type": "application/json"})
            return Response(json.dumps({"data": user}), 
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
        
@app.route("/get_user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    connection = connect()
    try:
        query = """SELECT * FROM users WHERE user_id = ?"""
        cursor = connection.cursor()
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        # Transforming query result to JSON
        user = {
                "user_id": result[0],
                "first_name": result[1],
                "last_name": result[2],
                "email": result[3],
                "created_at": result[5],
                "updated_at": result[6],
                "is_active": result[7],
                "is_admin": result[8]
            }

        return jsonify({"user": user}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

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
    
### PICTURES ###
@app.route("/upload_picture", methods=["POST"])
def upload_picture():
    if 'file' not in request.files:
        return Response(json.dumps({"error": "No file provided"}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})

    file = request.files['file']
    if file.filename == '':
        return Response(json.dumps({"error": "No file selected"}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})
    
    file_path = os.path.join(FILE_STORAGE_PATH, file.filename)
    file.save(file_path)
    
    description = request.form.get('description')
    user_id = request.form.get('user_id')

    if not description or not user_id:
        return Response(json.dumps({"error": "Missing form fields"}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})
    
    try:
        connection = connect()
        query = """INSERT INTO images (uploaded_image_url, user_id, description) VALUES (?, ?, ?)"""
        cursor = connection.cursor()
        cursor.execute(query, (file_path, user_id, description))
        connection.commit()
        
        return jsonify({"result": "Image uploaded successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route("/get_pictures", methods=["GET"])
def get_pictures():
    connection = connect()
    try:
        query = """SELECT * FROM images"""
        cursor = connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()

        images = []
        for row in result:
            image = {
                "image_id": row[0],
                "uploaded_image_url": row[1],
                "user_id": row[2],
                "created_at": row[3],
                "updated_at": row[4],
                "likes": row[5],
                "description": row[6]
            }
            images.append(image)

        return jsonify({"images": images}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
@app.route("/get_picture_by_id/<int:image_id>", methods=["GET"])
def get_picture_by_id(image_id):
    connection = connect()
    cursor = None
    try:
        query = """SELECT * FROM images WHERE image_id = ?"""
        cursor = connection.cursor()
        cursor.execute(query, (image_id,))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({"error": "Image not found"}), 404

        image = {
                "image_id": result[0],
                "uploaded_image_url": result[1],
                "user_id": result[2],
                "created_at": result[3],
                "updated_at": result[4],
                "likes": result[5],
                "description": result[6]
            }
        print(image)

        return jsonify({"image": image}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route("/edit_picture/<int:image_id>", methods=["OPTIONS", "PATCH"])
def edit_picture(image_id):
    if request.method == "OPTIONS":
        return Response(status=200, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PATCH, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        })
    
    if request.method == "PATCH":
        connection = connect()
        body = request.json
        print(body)
        try:
            query = """UPDATE images 
                SET description = ?
                WHERE image_id = ?"""
            cursor = connection.cursor()
            cursor.execute(query, (body['toEdit'], image_id,))
            connection.commit()
            return jsonify({"result": "Image updated successfully"}),200
        except Exception as e:
            return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
                           
@app.route("/delete_picture/<int:image_id>", methods=["OPTIONS","DELETE"])
def delete_picture(image_id):
    if request.method == "OPTIONS":
        return Response(status=200, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
        })
        
    if request.method == "DELETE":
        connection = connect()
        print(request.data)
        try:
            query = """DELETE FROM images WHERE image_id = ?"""
            cursor = connection.cursor()
            cursor.execute(query, (image_id,))
            connection.commit()
            return jsonify({"result": "Image deleted successfully"}), 200, {
                "Access-Control-Allow-Origin": "*"
            }
        except Exception as e:
            return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500, {
            "Access-Control-Allow-Origin": "*"
            }
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

### LIKES ###
@app.route("/like_picture/<int:image_id>", methods=["POST"])
def like_picture(image_id):
    connection = connect()
    cursor = None
    # print("Request Headers:", request.headers)
    try:
        body = request.json
        if not body:
            return jsonify({"error": "Missing user_id"}), 400
        
        if isinstance(body, dict) and 'user_id' in body:
            user_id = body['user_id']
        else:
            return jsonify({"error": "Invalid request payload"}), 400

        cursor = connection.cursor()

        query_check = """SELECT COUNT(*) FROM likes WHERE user_id = ? AND image_id = ?"""
        cursor.execute(query_check, (user_id, image_id))

        result = cursor.fetchone()
        print(result)

        if result[0] == 1:
            has_liked = 1
        else:
            has_liked = 0
            
        if has_liked != 0:
            return jsonify({"error": "User already liked this picture"}), 400

        query_insert = """INSERT INTO likes (user_id, image_id) VALUES (?, ?)"""
        cursor.execute(query_insert, (user_id, image_id))

        query_update = """UPDATE images SET likes = likes + 1 WHERE image_id = ?"""
        cursor.execute(query_update, (image_id,))

        connection.commit()

        return jsonify({"result": "Liking was successful"}), 200

    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
@app.route("/unlike_picture/<int:image_id>", methods=["DELETE", "OPTIONS"])
def unlike_picture(image_id):
    if request.method == "OPTIONS":
        return Response(status=200, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PATCH, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        })
        
    if request.method == "DELETE":
        connection = connect()
        cursor = None
        try:
            cursor = connection.cursor()
            body = request.json
            
            if not body:
                return jsonify({"error": "Missing user_id"}), 400
        
            if isinstance(body, dict) and 'user_id' in body:
                user_id = body['user_id']
            else:
                return jsonify({"error": "Invalid request payload"}), 400

            query_check = """SELECT COUNT(*) FROM likes WHERE image_id = ? AND user_id = ?"""
            cursor.execute(query_check, (image_id, user_id))
            result = cursor.fetchone()

            if result[0] == 0:
                return jsonify({"error": "Like not found"}), 400

            query_delete = """DELETE FROM likes WHERE image_id = ? AND user_id = ?"""
            cursor.execute(query_delete, (image_id, user_id))

            query_update = """UPDATE images SET likes = likes - 1 WHERE image_id = ?"""
            cursor.execute(query_update, (image_id,))

            connection.commit()

            return jsonify({"result": "Like was deleted"}), 200, {
                "Access-Control-Allow-Origin": "*"
            }

        except Exception as e:
            return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
@app.route("/get_likes/<int:image_id>", methods=["GET"])
def get_likes(image_id):
    connection = connect()
    cursor = None
    try:
        query =  """ 
            SELECT l.*, user.first_name, user.last_name
            from likes l 
            inner join users user on l.user_id = user.user_id
            where image_id = ?
        """
        cursor = connection.cursor()
        cursor.execute(query, (image_id,))
        result = cursor.fetchall()
        print(result)
        
        likes = []
        for row in result:
            like = {
                "like_id": row[0],
                "user_id": row[1],
                "created_at": row[2],
                "image_id": row[3],
                "user_first_name": row[4],
                "user_last_name": row[5]
            }
            likes.append(like)
        print(likes)
        query_count_likes = """SELECT COUNT(*) FROM likes WHERE image_id = ?"""
        cursor.execute(query_count_likes, (image_id,))
        likes_count = cursor.fetchone()[0]
       
        
        if not result:
            return jsonify({"likes": [], "likes_count": 0}), 200

        return jsonify({"likes": likes, "likes_count": likes_count}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    
@app.route("/get_user_likes/<int:image_id>/<int:user_id>", methods=["GET"])
def get_user_likes(image_id, user_id):
    connection = connect()
    cursor = None
    try:
        query =  """ 
            SELECT COUNT(*) FROM likes WHERE image_id = ? AND user_id = ?
        """
        cursor = connection.cursor()
        cursor.execute(query, (image_id, user_id,))
        result = cursor.fetchone()
        print(result)
        if result[0] == 0: 
            return jsonify({"result": 0}), 200

        return jsonify({"hasLiked": 1}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
       ####     

### FAVOURITES ###
@app.route("/add_to_favs/<int:image_id>", methods=["POST"])
def add_to_favs(image_id):
    connection = connect()
    cursor = None
    try:
        body = request.json
       #print(body)
        if not body:
            return jsonify({"error": "Missing user_id"}), 400
        
        if isinstance(body, dict) and 'user_id' in body:
            user_id = body['user_id']
        else:
            return jsonify({"error": "Invalid request payload"}), 400


        cursor = connection.cursor()

        query_check = """SELECT COUNT(*) FROM favourite_pictures WHERE user_id = ? AND image_id = ?"""
        cursor.execute(query_check, (user_id, image_id))

        result = cursor.fetchone()
        print(result)

        if result[0] == 1:
            has_added = 1
        else:
            has_added = 0
            
        if has_added != 0:
            return jsonify({"error": "User already added this picture to their fav"}), 400

        query_insert = """INSERT INTO favourite_pictures (user_id, image_id) VALUES (?, ?)"""
        cursor.execute(query_insert, (user_id, image_id))
        connection.commit()

        return jsonify({"result": "Adding to favs was successful"}), 200

    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
@app.route("/remove_from_favs/<int:image_id>", methods=["DELETE", "OPTIONS"])
def remove_from_favs(image_id):
    if request.method == "OPTIONS":
        return Response(status=200, headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PATCH, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        })
    #print(request.data)
    if request.method == "DELETE":
        connection = connect()
        cursor = None
        try:
            cursor = connection.cursor()
            body = request.json
            print(body)
            if not body:
                return jsonify({"error": "Missing user_id"}), 400
        
            if isinstance(body, dict) and 'user_id' in body:
                user_id = body['user_id']
            else:
                return jsonify({"error": "Invalid request payload"}), 400


            query_delete = """DELETE FROM favourite_pictures WHERE image_id = ? AND user_id = ?"""
            cursor.execute(query_delete, (image_id, user_id))

            connection.commit()

            return jsonify({"result": "Fav was deleted"}), 200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PATCH, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }

        except Exception as e:
            return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

@app.route("/get_favs/<int:user_id>", methods=["GET"])
def get_favs(user_id):
    connection = connect()
    cursor = None
    try:
        query =  """ 
            SELECT fp.*, im.uploaded_image_url
            from favourite_pictures fp
            inner join images im on fp.image_id = im.image_id
            where fp.user_id = ?
        """
        cursor = connection.cursor()
        cursor.execute(query, (user_id,))
        result = cursor.fetchall()
        print(result)
        
        favs = []
        for row in result:
            fav = {
                "fav_id": row[0],
                "user_id": row[1],
                "image_id": row[2],
                "created_at": row[3],
                "uploaded_image_url": row[4]
            }
            favs.append(fav)
        print(favs)
        if not result:
            return jsonify({"favs": []}), 200

        return jsonify({"favs": favs}), 200
    except Exception as e:
        return jsonify({"error": f"Something went wrong. Cause: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    
@app.route("/get_user_favs/<int:image_id>/<int:user_id>", methods=["GET"])
def get_user_favs(image_id, user_id):
    connection = connect()
    cursor = None
    try:
        query =  """ 
            SELECT COUNT(*) FROM favourite_pictures WHERE image_id = ? AND user_id = ?
        """
        cursor = connection.cursor()
        cursor.execute(query, (image_id, user_id,))
        result = cursor.fetchone()
        print(result)
        if result[0] == 0: 
            return jsonify({"result": 0}), 200

        return jsonify({"hasBeenAdded": 1}), 200
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
