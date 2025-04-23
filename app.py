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



@app.route('/register', methods=['GET', 'POST'])
def register():
    message = ''
    accounts = []

    if request.method == 'POST':
        if 'update_password' in request.form:
            # Handle password update
            username = request.form.get('username')
            new_password = request.form.get('new_password')

            if username and new_password:
                cursor = mysql.connection.cursor()
                cursor.execute('UPDATE admin SET password = %s WHERE username = %s AND usertype = "instructor"', (new_password, username))
                mysql.connection.commit()
                cursor.close()
                message = 'Password updated successfully.'
            else:
                message = 'Failed to update password. Missing data.'

        elif 'delete_account' in request.form:
            # Handle account deletion
            username = request.form.get('username')

            if username:
                cursor = mysql.connection.cursor()
                cursor.execute('DELETE FROM admin WHERE username = %s AND usertype = "instructor"', (username,))
                mysql.connection.commit()
                cursor.close()
                message = 'Account deleted successfully.'
            else:
                message = 'Failed to delete account. Username not provided.'

        else:
            # Handle new registration
            name = request.form.get('name')
            username = request.form.get('username')
            password = request.form.get('password')
            confirm_password = request.form.get('confirm_password')
            usertype = request.form.get('instructor')  # Always "instructor" from hidden input

            if not all([name, username, password, confirm_password, usertype]):
                message = 'Please fill out all fields.'
            elif password != confirm_password:
                message = 'Passwords do not match.'
            else:
                cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
                cursor.execute('SELECT * FROM admin WHERE username = %s', (username,))
                existing = cursor.fetchone()

                if existing:
                    message = 'Account already exists!'
                else:
                    cursor.execute(
                        'INSERT INTO admin (name, username, password, usertype) VALUES (%s, %s, %s, %s)',
                        (name, username, password, usertype)
                    )
                    mysql.connection.commit()
                    message = 'Account registered successfully!'
                cursor.close()

    # Fetch all instructor accounts to show in the modal
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM admin WHERE usertype = "instructor" ORDER BY date_created DESC')
    accounts = cursor.fetchall()
    cursor.close()

    return render_template('register.html', message=message, accounts=accounts)



@app.route('/available_sub')
def Available_sub():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM subj_avail')
        subjects = cursor.fetchall()
        cursor.close()
        return render_template('Available_sub.html', subjects=subjects)
    return redirect(url_for('login'))



@app.route('/admin_dashboard', methods=['GET', 'POST'])
def admin_dashboard():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        if request.method == 'POST':
            subject_code = request.form['subject_code']
            subject_name = request.form['subject_name']
            course_id = request.form['course_id']
            year = request.form['year']
            semester = request.form['semester']
            room = request.form['room']
            start_time = request.form['start_time']
            end_time = request.form['end_time']
            days = ','.join(request.form.getlist('days'))

            insert_query = """
                INSERT INTO subject (subject_code, subject, course_id, year, semester, room, start_time, end_time, days)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (subject_code, subject_name, course_id, year, semester, room, start_time, end_time, days))
            mysql.connection.commit()

            return redirect(url_for('admin_dashboard'))

        # Filtering logic
        search = request.args.get('search', '').strip()
        course = request.args.get('course', '')
        year = request.args.get('year', '')
        semester = request.args.get('semester', '')

        query = "SELECT * FROM subject WHERE 1=1"
        params = []

        if search:
            query += " AND (subject_code LIKE %s OR subject LIKE %s)"
            like = f"%{search}%"
            params.extend([like, like])
        if course:
            query += " AND course_id = %s"
            params.append(course)
        if year:
            query += " AND year = %s"
            params.append(year)
        if semester:
            query += " AND semester = %s"
            params.append(semester)

        cursor.execute(query, params)
        subjects = cursor.fetchall()
        cursor.close()

        return render_template('admin_dashboard.html', subjects=subjects)

    return redirect(url_for('login'))




@app.route('/student_dashboard')
def student_dashboard():
    if 'usertype' in session and session['usertype'] == 'admin':
        
        return render_template('student_dashboard.html')
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


if __name__ == "__main__":
    app.run(debug=True, port=81)
