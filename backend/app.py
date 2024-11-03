from datetime import datetime
import json
from flask import Flask, request, Response, send_from_directory
from entities import User

app = Flask("app")

@app.route("/", methods=["GET"])
def home():
    return send_from_directory('frontend', 'index.html')

@app.route("/login", methods=["GET"])
def login():
    return send_from_directory('frontend', 'login.html')

@app.route("/version", methods=["GET"])
def version():
    response = {
        "version": "1.0.0",
        "requested_at": str(datetime.now())
    }
    return Response(json.dumps(response), content_type="application/json")

@app.route("/signin", methods=["GET", "POST"])
def signin():
    # Debugging output
    print("Request Data:", request.data)
    
    # Check if the content type is JSON
    if request.content_type != 'application/json':
        return Response(json.dumps({"error": "Content-Type must be application/json"}), 
                        status=415,  # Unsupported Media Type
                        headers={"Content-Type": "application/json"})
    
    body = request.json

    # Validate input
    if not body or "email" not in body or "password" not in body:
        return Response(json.dumps({"error": "Invalid request."}), 
                        status=400, 
                        headers={"Content-Type": "application/json"})
    
    # Process login
    user = User()
    try:
        user.get_by_email(email=body["email"])
        if user.password == body["password"]:
            response_data = {"id": user.id, "first_name": user.first_name}
            return Response(json.dumps({"data": response_data}), 
                            status=200, 
                            headers={"Content-Type": "application/json"})
        else:
            return Response(json.dumps({"error": "Invalid email or password."}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})
    except Exception as e:
        print("Error:", e)  # Log the error for debugging
        return Response(json.dumps({"error": "User not found."}), 
                        status=404, 
                        headers={"Content-Type": "application/json"})

@app.route("/signup", methods=["POST"])
def signup():
    body = request.json
    
    user = User()
    try:
        user.from_dict(body)
        user.get_by_email(email=user.email)
        if user.id is not None:
            return Response(json.dumps({"error": "Email already exists"}), 
                            status=400, 
                            headers={"Content-Type": "application/json"})
        
        user.is_active = 1
        user.created_at = datetime.now()
        user.updated_at = datetime.now()
        user.insert()  # Make sure to pass connection if needed
        response_data = {"id": user.id, "first_name": user.first_name}
        return Response(json.dumps({"data": response_data}), 
                        status=200, 
                        headers={"Content-Type": "application/json"})
    except Exception as e:
        return Response(json.dumps({"error": f"Something went wrong. Cause: {e}"}), 
                        status=400,
                        headers={"Content-Type": "application/json"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
