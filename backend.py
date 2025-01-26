from flask import Flask, request, jsonify, send_from_directory
import sqlite3

app = Flask(__name__)

def get_db_connection():
    connection = sqlite3.connect("teammates.db", check_same_thread=False)
    connection.row_factory = sqlite3.Row
    return connection

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/add_teammate', methods=['POST'])
def add_teammate():
    data = request.json
    name = data.get('name')
    skills = data.get('skills')
    availability = data.get('availability')
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO teammates (name, skills, availability) VALUES (?, ?, ?)", 
                       (name, skills, availability))
        connection.commit()
        connection.close()
        return jsonify({"message": f"Teammate {name} added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_teammates', methods=['GET'])
def get_teammates():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT name, skills, availability FROM teammates")
        teammates = cursor.fetchall()
        connection.close()
        return jsonify(teammates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/find_teammates', methods=['POST'])
def find_teammates():
    data = request.json
    target_skills = set(skill.strip() for skill in data.get('skills').split(','))
    target_availability = set(data.get('availability').split(','))

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT name, skills, availability FROM teammates")
        compatible = []

        for row in cursor.fetchall():
            name, skills, availability = row
            teammate_skills = set(skill.strip() for skill in skills.split(','))
            teammate_availability = set(availability.split(','))
            if target_skills.issubset(teammate_skills) and target_availability.intersection(teammate_availability):
                compatible.append(name)

        connection.close()
        return jsonify(compatible)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
