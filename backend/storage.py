import sqlite3

def connect():
    return sqlite3.connect("D:\\DogTerest\\backend\\app.db")

connection = connect()

# 1. create a query
query = """CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    is_admin BOOLEAN DEFAULT 0
);"""
# 2. add values to the query (depending on the situation)
# 3. run the query
# 3.1. create a cursor
cursor = connection.cursor()

# 3.2 use the cursor to run the query
cursor.execute(query)
# 4. commit the results (if you update the databse)
connection.commit()
# 5. close the cursor (optional, ideal)
cursor.close()
# 6. close the connection (optional, ideal)
connection.close()

# === CREATE TABLE FILES TABLE === #
query = """CREATE TABLE IF NOT EXISTS images (
    image_id INTEGER PRIMARY KEY AUTOINCREMENT,
    uploaded_image_url VARCHAR NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    description VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );"""
    
connection = connect()
cursor = connection.cursor()
cursor.execute(query)
connection.commit()
cursor.close()
connection.close()

query = """CREATE TABLE IF NOT EXISTS likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES user_files (id) ON DELETE CASCADE
    );"""
    
connection = connect()
cursor = connection.cursor()
cursor.execute(query)
connection.commit()
cursor.close()
connection.close()

query = """CREATE TABLE IF NOT EXISTS favourite_pictures (
    fav_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES user_files (id) ON DELETE CASCADE
    );"""
    
#     CREATE TABLE IF NOT EXISTS favourite_pictures (
#     fav_id INTEGER PRIMARY KEY AUTOINCREMENT,
#     user_id INTEGER NOT NULL,
#     image_id INTEGER NOT NULL,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
#     FOREIGN KEY (image_id) REFERENCES user_files (id) ON DELETE CASCADE
# );
connection = connect()
cursor = connection.cursor()
cursor.execute(query)
connection.commit()
cursor.close()
connection.close()

query = """CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name VARCHAR,
    user_id INTEGER NOT NULL,
    user_first_name VARCHAR,
    user_last_name VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"""

connection = connect()
cursor = connection.cursor()
cursor.execute(query)
connection.commit()
cursor.close()
connection.close()