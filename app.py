from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import datetime

    
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


@app.route('/instructor_dashboard')
def instructor_dashboard():
    if 'usertype' in session and session['usertype'] == 'instructor':
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
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
    if 'usertype' not in session or session['usertype'] != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    try:
        student_search = request.form.get('student_search')
        print(f"Searching for student: {student_search}")  # Debug print
        
        if not student_search:
            return jsonify({'error': 'Please enter a Student Name or USN'}), 400

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Get student details
        cursor.execute("""
            SELECT student_id, USN, name 
            FROM student 
            WHERE USN = %s OR name LIKE %s
        """, (student_search, f'%{student_search}%'))
        
        student = cursor.fetchone()
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        # Get enrolled subjects
        cursor.execute("""
            SELECT 
                ss.subj_avail_id,
                sa.Sub_code,
                s.subject,
                sa.day_of_week,
                sa.start_time,
                sa.end_time,
                sa.room,
                sa.units
            FROM student_subject ss
            JOIN subj_avail sa ON ss.subj_avail_id = sa.sub_avail_id
            JOIN subject s ON sa.subject_id = s.subject_id
            WHERE ss.student_id = %s
        """, (student['student_id'],))
        
        enrolled_subjects = cursor.fetchall()
        
        # Convert time objects to strings
        for subject in enrolled_subjects:
            subject['start_time'] = str(subject['start_time'])
            subject['end_time'] = str(subject['end_time'])

        return jsonify({
            'success': True,
            'student': {
                'student_id': student['student_id'],
                'usn': student['USN'],
                'name': student['name']
            },
            'enrolled_subjects': enrolled_subjects
        })
        
    except Exception as e:
        print(f"Error in get_student: {str(e)}")  # Debug print
        return jsonify({'error': f'Error fetching student data: {str(e)}'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()


@app.route('/instructor/check_time_conflict', methods=['POST'])
def check_time_conflict():
    """
    Check if there's a time conflict between a new subject and existing enrolled subjects.
    """
    if 'usertype' not in session or session['usertype'] != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403
        
    student_id = request.form.get('student_id')
    subj_avail_id = request.form.get('subj_avail_id')
    day_of_week = request.form.get('day_of_week')
    start_time = request.form.get('start_time')
    end_time = request.form.get('end_time')
    
    # Split days if multiple days are selected (e.g., "Monday, Wednesday")
    days = [day.strip() for day in day_of_week.split(',')]
    
    # Convert time strings to datetime.time objects for comparison
    try:
        start_time_obj = datetime.datetime.strptime(start_time, '%H:%M:%S').time()
        end_time_obj = datetime.datetime.strptime(end_time, '%H:%M:%S').time()
    except ValueError:
        try:
            start_time_obj = datetime.datetime.strptime(start_time, '%H:%M').time()
            end_time_obj = datetime.datetime.strptime(end_time, '%H:%M').time()
        except ValueError:
            return jsonify({'error': 'Invalid time format'}), 400
    
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT sa.subj_avail_id, sa.day_of_week, sa.start_time, sa.end_time, s.subject
        FROM student_subject ss
        JOIN subj_avail sa ON ss.subj_avail_id = sa.sub_avail_id
        JOIN subject s ON sa.subject_id = s.subject_id
        WHERE ss.student_id = %s
    """, (student_id,))
    
    existing_subjects = cur.fetchall()
    cur.close()

    for subject in existing_subjects:
        existing_days = [day.strip() for day in subject['day_of_week'].split(',')]
        # Convert stored time to time objects
        existing_start = subject['start_time']
        existing_end = subject['end_time']

        if isinstance(existing_start, str):
            try:
                existing_start = datetime.datetime.strptime(existing_start, '%H:%M:%S').time()
                existing_end = datetime.datetime.strptime(existingEnd, '%H:%M:%S').time()
            except ValueError:
                existing_start = datetime.datetime.strptime(existingStart, '%H:%M').time()
                existing_end = datetime.datetime.strptime(existingEnd, '%H:%M').time()
        
        # Check for overlapping days
        if any(day in existing_days for day in days):
            # Check for time overlap
            if (start_time_obj < existing_end and end_time_obj > existing_start):
                return jsonify({
                    'conflict': True,
                    'message': f"Time conflict with subject '{subject['subject']}' scheduled on {subject['day_of_week']} from {existing_start} to {existing_end}."
                })

    return jsonify({'conflict': False, 'message': 'No time conflict detected.'})



@app.route('/instructor/enlist_subject', methods=['POST'])
def enlist_subject():
    if session.get('usertype') != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        student_id = request.form.get('student_id')
        subj_avail_id = request.form.get('subj_avail_id')
        
        print(f"Debug - Received data: student_id={student_id}, subj_avail_id={subj_avail_id}")  # Debug print
        
        if not student_id:
            return jsonify({'success': False, 'message': 'Student ID is required'}), 400
        if not subj_avail_id:
            return jsonify({'success': False, 'message': 'Subject ID is required'}), 400

        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        # Get actual student_id from USN
        cur.execute("SELECT student_id FROM student WHERE USN = %s", (student_id,))
        student = cur.fetchone()
        if not student:
            return jsonify({'success': False, 'message': 'Student not found'}), 404
            
        actual_student_id = student['student_id']

        # Verify subject exists
        cur.execute("SELECT sub_avail_id FROM subj_avail WHERE sub_avail_id = %s", (subj_avail_id,))
        if not cur.fetchone():
            return jsonify({'success': False, 'message': 'Subject not found'}), 404

        # Check for existing enrollment
        cur.execute(
            "SELECT 1 FROM student_subject WHERE student_id = %s AND subj_avail_id = %s",
            (actual_student_id, subj_avail_id)
        )
        if cur.fetchone():
            return jsonify({'success': False, 'message': 'Student already enrolled in this subject'}), 400

        # Insert enrollment
        cur.execute(
            "INSERT INTO student_subject (student_id, subj_avail_id) VALUES (%s, %s)",
            (actual_student_id, subj_avail_id)
        )
        mysql.connection.commit()

        return jsonify({
            'success': True,
            'message': 'Successfully enlisted in subject'
        })

    except Exception as e:
        print(f"Error in enlist_subject: {str(e)}")  # Debug print
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        if 'cur' in locals():
            cur.close()




@app.route('/instructor/get_subject_students/<int:subj_avail_id>')
def get_subject_students(subj_avail_id):
    """
    Get all students enrolled in a specific subject
    """
    if 'usertype' not in session or session['usertype'] != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403
        
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT s.student_id, s.name, s.course, s.year, ss.date_enrolled
        FROM student_subject ss
        JOIN student s ON ss.student_id = s.student_id
        WHERE ss.subj_avail_id = %s
        ORDER BY s.name
    """, (subj_avail_id,))
    students = cur.fetchall()
    cur.close()
    
    return jsonify({'students': students})


@app.route('/instructor/remove_enrollment', methods=['POST'])
def remove_enrollment():
    """
    Remove a student from a subject
    """
    if 'usertype' not in session or session['usertype'] != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403

    student_id = request.form.get('student_id')
    subj_avail_id = request.form.get('subj_avail_id')

    if not student_id or not subj_avail_id:
        return jsonify({
            'success': False,
            'message': 'Missing student ID or subject availability ID.'
        }), 400

    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            "DELETE FROM student_subject WHERE student_id = %s AND subj_avail_id = %s",
            (student_id, subj_avail_id)
        )
        mysql.connection.commit()
        cursor.close()

        return jsonify({
            'success': True,
            'message': 'Student successfully unenrolled from subject.'
        })
    except Exception as e:
        print(f"Error in remove_enrollment: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred while trying to remove enrollment.'
        }), 500



@app.route('/instructor/get_available_subjects', methods=['POST'])
def get_available_subjects():
    if 'usertype' not in session or session['usertype'] != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    try:
        student_id = request.form.get('student_id', '').strip()
        print(f"Raw student_id received: '{student_id}'")
        
        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Updated query with explicit column selection and better joins
        query = """
            SELECT 
                CAST(sa.subj_avail_id AS UNSIGNED) as subj_avail_id,
                sa.Sub_code,
                s.subject as subject_name,
                sa.day_of_week,
                TIME_FORMAT(sa.start_time, '%H:%i') as start_time,
                TIME_FORMAT(sa.end_time, '%H:%i') as end_time,
                sa.room,
                sa.units
            FROM subj_avail sa
            INNER JOIN subject s ON sa.subject_id = s.subject_id
            WHERE sa.subj_avail_id NOT IN (
                SELECT DISTINCT ss.subj_avail_id 
                FROM student_subject ss 
                WHERE ss.student_id = %s
            )
            ORDER BY sa.subj_avail_id
        """
        
        cursor.execute(query, (student_id,))
        subjects = cursor.fetchall()
        print(f"Found {len(subjects)} subjects")
        
        # Format and validate the subjects
        formatted_subjects = []
        for subject in subjects:
            try:
                subject_data = {
                    'subj_avail_id': int(subject['subj_avail_id']),
                    'Sub_code': subject['Sub_code'],
                    'subject_name': subject['subject_name'],
                    'day_of_week': subject['day_of_week'],
                    'start_time': subject['start_time'],
                    'end_time': subject['end_time'],
                    'room': subject['room'],
                    'units': subject['units']
                }
                formatted_subjects.append(subject_data)
                print(f"Processed subject: {subject_data}")
            except (TypeError, ValueError) as e:
                print(f"Error processing subject {subject}: {e}")
                continue
        
        return jsonify({
            'success': True,
            'subjects': formatted_subjects
        })
        
    except Exception as e:
        print(f"Error in get_available_subjects: {str(e)}")
        return jsonify({'error': f'Error fetching available subjects: {str(e)}'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
    
        

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


@app.route('/get_enrolled_subjects/<int:student_id>')
def get_enrolled_subjects(student_id):
    # Replace with your actual database query
    cursor = mysql.connection.cursor(dictionary=True)
    query = """
        SELECT e.subject_id, s.Sub_code, s.subject_name, 
               sa.day_of_week, sa.start_time, sa.end_time, 
               sa.room, s.units
        FROM enrollments e
        JOIN subject_availability sa ON e.subj_avail_id = sa.subj_avail_id
        JOIN subjects s ON sa.Sub_code = s.Sub_code
        WHERE e.student_id = %s
    """
    cursor.execute(query, (student_id,))
    subjects = cursor.fetchall()
    cursor.close()
    
    return jsonify({'subjects': subjects})

@app.route('/drop_subject/<int:subject_id>', methods=['POST'])
def drop_subject(subject_id):
    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # First try to delete using subj_avail_id
        cursor.execute("SELECT student_id FROM student_subject WHERE subj_avail_id = %s", (subject_id,))
        result = cursor.fetchone()
        
        if result:
            # Delete the enrollment
            cursor.execute("DELETE FROM student_subject WHERE subj_avail_id = %s", (subject_id,))
            mysql.connection.commit()
            
            return jsonify({
                'success': True,
                'student_id': result['student_id'],
                'message': 'Subject dropped successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Enrollment not found'
            })
            
    except Exception as e:
        print(f"Error dropping subject: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error dropping subject: {str(e)}'
        })
    finally:
        cursor.close()

@app.route('/instructor/search_students', methods=['POST'])
def search_students():
    if 'usertype' not in session or session['usertype'] != 'instructor':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        search_term = request.form.get('search', '').strip()
        print(f"Searching for: {search_term}")  # Debug print
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Updated query to match actual database columns
        cursor.execute("""
            SELECT 
                student_id,
                USN,
                name
            FROM student 
            WHERE 
                name LIKE %s OR
                USN LIKE %s
            ORDER BY 
                CASE 
                    WHEN name = %s THEN 1
                    WHEN name LIKE %s THEN 2
                    ELSE 3
                END,
                name
            LIMIT 10
        """, (f"%{search_term}%", f"%{search_term}%", search_term, f"{search_term}%"))
        
        students = cursor.fetchall()
        cursor.close()
        
        return jsonify({
            'success': True,
            'students': students
        })
        
    except Exception as e:
        print(f"Error in search_students: {str(e)}")  # Debug print
        return jsonify({'error': 'Error searching students'}), 500

if __name__ == "__main__":
    app.run(debug=True, port=81)
