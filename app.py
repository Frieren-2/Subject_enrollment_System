from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re

app = Flask(__name__, template_folder="template")
app.secret_key = 'xyzsdfg'
  
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'subject_enlist'

mysql = MySQL(app)

# Login Route
@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    message = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM admin WHERE username = %s AND password = %s', (username, password))
        user = cursor.fetchone()
        if user:
            session['loggedin'] = True
            session['username'] = user['username']
            session['usertype'] = user['usertype']
            
            if user['usertype'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            elif user['usertype'] == 'instructor':
                return redirect(url_for('instructor_dashboard'))
        else:
            message = 'Please enter the correct username/password!'
    return render_template('login.html', message=message)

# Logout Route
@app.route('/logout')
def logout():
    session.pop('admin_id', None)
    session.pop('username', None)
    session.pop('usertype', None)
    return redirect(url_for('login'))   

# Register Route
@app.route('/register', methods=['GET', 'POST'])
def register():
    message = ''
    accounts = []

    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        usertype = request.form['instructor']

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM admin WHERE username = %s', (username,))
        account = cursor.fetchone()

        if account:
            message = 'Account already exists!'
        elif not username or not password:
            message = 'Please fill out the form!'
        else:
            cursor.execute('INSERT INTO admin (name, username, password, usertype) VALUES (%s, %s, %s, %s)',(name, username, password, usertype))
            mysql.connection.commit()
            message = 'Account registered successfully!'
        cursor.close()

    # Fetch all instructors
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM admin WHERE usertype = "instructor" ORDER BY date_created DESC')
    accounts = cursor.fetchall()
    cursor.close()
    

    return render_template('register.html', message=message, accounts=accounts)


@app.route('/available_sub')
def Available_sub():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM subject')
        subjects = cursor.fetchall()
        cursor.close()
        return render_template('Available_sub.html', subjects=subjects)
    return redirect(url_for('login'))

@app.route('/admin_dashboard')
def admin_dashboard():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM subject")
        subjects = cursor.fetchall()
        cursor.close()
        return render_template('admin_dashboard.html', subjects=subjects)
    return redirect(url_for('login'))



@app.route('/student_dashboard')
def student_dashboard():
    if 'usertype' in session and session['usertype'] == 'admin':
        
        return render_template('student_dashboard.html')
    return redirect(url_for('login'))

@app.route('/add_instructor_acc')
def add_instructor_acc():
    if 'usertype' in session and session['usertype'] == 'admin':
        
        return render_template('add_instructor_acc.html')
    return redirect(url_for('login'))

@app.route('/instructor_dashboard')
def instructor_dashboard():
    if 'usertype' in session and session['usertype'] == 'instructor':
        return render_template('instructor_dashboard.html')
    return redirect(url_for('login'))

@app.route('/student_list')
def student_list():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM student')
        student = cursor.fetchall()
        cursor.close()
        return render_template('student_list.html', students=student)
    return redirect(url_for('login'))

@app.route('/subject_list')
def subject_list():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM subjects')
        subjects = cursor.fetchall()
        cursor.close()
        return render_template('subject_list.html', subjects=subjects)
    return redirect(url_for('login'))

@app.route('/enrollment_requests')
def enrollment_requests():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM enrollments WHERE status="pending"')
        requests = cursor.fetchall()
        cursor.close()
        return render_template('enrollment_requests.html', requests=requests)
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True, port=81)
