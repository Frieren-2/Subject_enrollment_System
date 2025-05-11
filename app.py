from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors

    
app = Flask(__name__, template_folder="template")
app.secret_key = 'xyzsdfg'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'subject_enlisting'

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
    cursor.execute('SELECT * FROM admin WHERE usertype = "instructor" ORDER BY time_created DESC')
    accounts = cursor.fetchall()
    cursor.close()

    return render_template('register.html', message=message, accounts=accounts)



@app.route('/available_sub')
def Available_sub():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        query = '''
            SELECT sa.*, 
                i.name AS instructor_name,
                s.subject AS subject_name
            FROM subj_avail sa
            LEFT JOIN instructor i ON sa.instructor_id = i.instructor_id
            LEFT JOIN subject s ON sa.subject_id = s.subject_id
        '''
        cursor.execute(query)
        subjects = cursor.fetchall()
        cursor.close()
        return render_template('Available_sub.html', subjects=subjects)
    return redirect(url_for('login'))



@app.route('/admin_dashboard', methods=['GET', 'POST'])
def admin_dashboard():
    if 'usertype' in session and session['usertype'] == 'admin':
        try:
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            query = "SELECT * FROM subject"
            cursor.execute(query)
            subjects = cursor.fetchall()

            cursor.execute("SELECT * FROM instructor")  # Fetch instructors for the dropdown
            instructors = cursor.fetchall()
            cursor.close()

            return render_template('admin_dashboard.html', subjects=subjects, instructors=instructors)
        except Exception as e:
            print(f"Error: {e}")
            return render_template('error.html', message="Error retrieving data.")
    return redirect(url_for('login'))


@app.route('/insert_subject_avail', methods=['POST'])
def insert_subject_avail():
    if 'usertype' in session and session['usertype'] == 'admin':
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        # Retrieve the data from the form
        subject_code = request.form['subject_code']
        course = request.form['course']
        year = request.form['year']
        semester = request.form['semester']
        units = request.form['units']
        room = request.form['room']
        start_time = request.form['start_time']
        end_time = request.form['end_time']
        days = request.form.getlist('days')  # Get the list of selected days
        instructor_id = request.form['instructor_id']
        subject_id = request.form['subject_id']

        # Convert the list of days to a comma-separated string
        day_of_week = ', '.join(days)

        # SQL query to insert data into subj_avail
        insert_query = """
            INSERT INTO subj_avail (Sub_code, course, year, semester, units, room, start_time, end_time, day_of_week, instructor_id, subject_id) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (subject_code, course, year, semester, units, room, start_time, end_time, day_of_week, instructor_id, subject_id))
        mysql.connection.commit()

        # Close the cursor and redirect to a page (optional)
        cursor.close()
        return redirect(url_for('admin_dashboard'))  # You can redirect to any relevant page
    return redirect(url_for('login'))


@app.route('/remove_subject/<int:subject_id>', methods=['POST'])
def remove_subject(subject_id):
    if 'usertype' in session and session['usertype'] == 'admin':
        try:
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            # Delete the subject from subj_avail table
            delete_query = "DELETE FROM subj_avail WHERE sub_avail_id = %s"
            cursor.execute(delete_query, (subject_id,))
            mysql.connection.commit()
            cursor.close()
            return redirect(url_for('Available_sub'))
        except Exception as e:
            print(f"Error: {e}")
            return render_template('error.html', message="Error deleting subject.")
    return redirect(url_for('login'))




@app.route('/student_dashboard')
def student_dashboard():
    if 'usertype' in session and session['usertype'] == 'admin':
        
        return render_template('student_dashboard.html')
    return redirect(url_for('login'))



@app.route('/instructor_dashboard')
def instructor_dashboard():
    if 'usertype' in session and session['usertype'] == 'instructor':
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT sa.*, 
                   i.name AS instructor_name,
                   s.subject AS subject_name
            FROM subj_avail sa
            LEFT JOIN instructor i ON sa.instructor_id = i.instructor_id
            LEFT JOIN subject s ON sa.subject_id = s.subject_id
        """)
        subjects = cur.fetchall()
        cur.close()
        return render_template('instructor_dashboard.html', subjects=subjects)
    return redirect(url_for('login'))

@app.route('/instructor/get_student', methods=['POST'])
def get_student():
    student_id = request.form['student_id']
    cur = mysql.connection.cursor()

    # Get student basic info
    cur.execute("SELECT * FROM student WHERE student_id = %s", (student_id,))
    student = cur.fetchone()

    # Get student's enrolled subjects
    cur.execute("""
        SELECT s.subject_id, s.subject, sa.room, sa.day_of_week, sa.start_time, sa.end_time
        FROM student_subject ss
        JOIN subj_avail sa ON ss.subj_avail_id = sa.subj_avail_id
        JOIN subject s ON sa.subject_id = s.subject_id
        WHERE ss.student_id = %s
    """, (student_id,))
    enrolled_subjects = cur.fetchall()

    cur.close()

    if student:
        return jsonify({'student': student, 'enrolled_subjects': enrolled_subjects})
    else:
        return jsonify({'error': 'Student not found'}), 404





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
