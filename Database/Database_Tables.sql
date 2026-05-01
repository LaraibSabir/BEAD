
create database Teacher_Evaluation_System;

CREATE TABLE Login (
Id INT IDENTITY(1,1) PRIMARY KEY,
User_id VARCHAR(20),
User_name VARCHAR(100),
User_type VARCHAR(20),
User_password VARCHAR(30),

);

create table Student(
Reg_no varchar(14) primary key,
St_firstName varchar(25) not null,
St_middlename varchar(25),
St_lastname varchar(25) not null,
Fathername varchar (50) not null,
Session varchar(12) not null,
Section char(1) not null,Discipline varchar(12),
Gender char(1) not null,
Semester Varchar(20)
)


SELECT * FROM Student;

create table Teacher(
Emp_no varchar(14) primary key,
Emp_firstName varchar(25) not null,
Emp_middlename varchar(25) ,
Emp_lastname varchar(25) not null,
Gender char(1) not null,
Status varchar (15) not null,
Session varchar(12) not null,
Evaluator char(1) not null,Emp_email varchar(30),
Designation VARCHAR(20)
)


create table Course(
Course_no varchar(9) not null primary key,
Dicipline varchar(12) not null,
Course_des varchar(80) not null,
credit_hrs char(10) not null,
Course_type char(15) not null
)


create table Semester(
Session varchar(12) primary key not null,
Semester_desc varchar(20) not null,
StartDate datetime,
EndTime datetime)

create table Question(
Question_Id int identity(1,1) primary key,
Question varchar(max) not null,
Question_type varchar(12))

create table EvalStudent(
Emp_no varchar(14) ,
Reg_no varchar(14),
Course_no varchar(9),
Dicipline varchar(12),
Session varchar(12),
Section char(1) not null,
Question_Id int,
Answer_Desc nvarchar(50),
Answer_Marks int,
Semester Varchar(20),
FOREIGN KEY (Emp_no) REFERENCES Teacher(Emp_no),
FOREIGN KEY (Reg_no) REFERENCES Student(Reg_no),
FOREIGN KEY (Course_no) REFERENCES Course(Course_no),
FOREIGN KEY (Question_Id) REFERENCES Question(Question_Id))

create table CourseAllocateT(
Emp_no varchar(14) ,
Course_no varchar(9),
Discipline varchar(12),
Session varchar(12),
Section char(1) not null,
FOREIGN KEY (Emp_no) REFERENCES Teacher(Emp_no),
FOREIGN KEY (Course_no) REFERENCES Course(Course_no))

create table CourseEnrollS(
Emp_no varchar(14) ,
Reg_no varchar(14),
Course_no varchar(9) ,
Dicipline varchar(12),
Session varchar(12),
Section char(1) not null,
Final_Score decimal(5,2),
Mid_Score decimal(5,2),
Assi_Score decimal(5,2),
Prac_Score decimal(5,2),
Q_point decimal(5,2),
Attemp nchar(1),
Grade varchar(1),
FOREIGN KEY (Emp_no) REFERENCES Teacher(Emp_no),
FOREIGN KEY (Reg_no) REFERENCES Student(Reg_no),
FOREIGN KEY (Course_no) REFERENCES Course(Course_no)
)

create table CHR(
Emp_no varchar(14) ,
Course_no varchar(9),
Status varchar(15),
TimeIn Datetime,
Timeout Datetime,
venue varchar(15),
FOREIGN KEY (Emp_no) REFERENCES Teacher(Emp_no),
FOREIGN KEY (Course_no) REFERENCES Course(Course_no))

create table ConQuestion(
Question_Id int identity(1,1) primary key,
Question varchar(max) not null,
Question_type varchar(12)) --Behaviour/simple

create table EvalConStudent(
Emp_no varchar(14) ,
Course_no varchar(9),
Reg_no varchar(14),
Dicipline varchar(12),
Session varchar(12),
Section char(1) not null,
Question_Id int,
Answer_Desc nvarchar(50),
Answer_Marks int,
FOREIGN KEY (Emp_no) REFERENCES Teacher(Emp_no),
FOREIGN KEY (Reg_no) REFERENCES Student(Reg_no),
FOREIGN KEY (Course_no) REFERENCES Course(Course_no),
FOREIGN KEY (Question_Id) REFERENCES Question(Question_Id))



-------------------------------------------------------------------------------------------

--Insertion 
INSERT INTO Login  VALUES
('BIIT301','Ali Raza','Teacher','123'),
('BIIT302','Sana Malik','Teacher','123'),
('BIIT303','Usman Khan','Teacher','123'),
('BIIT304','Hina Ashraf','Teacher','123'),
('BIIT305','Kamran Iqbal','Teacher','123'),
('2025-ARID-001','Muhammad Abdullah Khan','Student','001'),
('2025-ARID-002','Muhammad Afzal Tariq ','Student','002'),
('2024-ARID-003','Ali Raza','Student','003'),
('2024-ARID-004','Ahmad Hasssan Ali','Student','004'),
('2023-ARID-005','Fatima Noor','Student','005'),
('2019-ARID-013','DANISH AHMED MUGHAL','Student','013'),
('2019-ARID-014','LAIBA KHAN','Student','014'),
('2018-ARID-015','UMAR FAROOQ RAZA','Student','015');


INSERT INTO Login  VALUES
('2018-ARID-016','ZAINAB NOOR SIDDIQUI','Student','016');

-- =================================================================================================================================

INSERT INTO Student VALUES
('2025-ARID-001','MUHAMMAD','ABDULLAH','KHAN','IJAZ KHAN','2025FM','A','BSSE','M',1),
('2025-ARID-002','MUHAMMAD','AFZAL','TARIQ','TARIQ MEHMOOD','2025SM','A','BSSE','M',1),
('2024-ARID-003','ALI',NULL,'RAZA','HAFEEZ RAZA','2024SM','B','BSCS','M',2),
('2024-ARID-004','AHMAD','HASSAN','ALI','HASSAN ALI','2024FM','B','BSIT','M',2),
('2023-ARID-005','FATIMA',NULL,'NOOR','ASIF NOOR','2023SM','A','BSSE','F',3),
('2023-ARID-006','AISHA','KIRAN','MALIK','KHALID MALIK','2023FM','A','BSCS','F',3),
('2022-ARID-007','HAMZA',NULL,'IQBAL','JAVED IQBAL','2022SM','C','BSIT','M',4),
('2022-ARID-008','USMAN','ALI','BUTT','IMTIAZ BUTT','2022FM','C','BSSE','M',4),
('2021-ARID-009','HIRA',NULL,'YASIN','MOHSIN YASIN','2021SM','B','BSCS','F',5),
('2021-ARID-010','BILAL','AHMED','QURESHI','NASIR QURESHI','2021FM','A','BSIT','M',5),
('2020-ARID-011','SAAD',NULL,'HUSSAIN','IMRAN HUSSAIN','2020SM','B','BSCS','M',6),
('2020-ARID-012','AMNA','FATIMA','SHAH','ALI SHAH','2020FM','A','BSIT','F',6),
('2019-ARID-013','DANISH','AHMED','MUGHAL','AHMED MUGHAL','2019SM','C','BSSE','M',7),
('2019-ARID-014','LAIBA',NULL,'KHAN','SALMAN KHAN','2019FM','B','BSCS','F',7),
('2018-ARID-015','UMAR','FAROOQ','RAZA','FAROOQ RAZA','2018SM','A','BSIT','M',8),
('2018-ARID-016','ZAINAB','NOOR','SIDDIQUI','KAMRAN SIDDIQUI','2018FM','B','BSSE','F',8);

INSERT INTO Course VALUES
('CS-101','BSCS','Programming Fundamentals','3(2-1)','Core'),
('CS-102','BSCS','Object Oriented Programming','3(2-1)','Core'),
('CS-103','BSCS','Advanced Programming','3(2-1)','Core'),
('CS-104','BSCS','Web Technologies','3(2-1)','Core'),
('CS-201','BSCS','Data Structures','3(2-1)','Core'),
('CS-202','BSCS','Database Systems','3(2-1)','Core'),
('CS-203','BSCS','Algorithms','3(2-1)','Core'),
('CS-204','BSCS','Software Engineering','3(2-1)','Core'),
('CS-301','BSCS','Operating Systems','3(2-1)','Core'),
('CS-302','BSCS','Computer Networks','3(2-1)','Core'),
('SE-101','BSSE','Introduction to SE','3(2-1)','Core'),
('SE-202','BSSE','Software Design','3(2-1)','Core'),
('IT-101','BSIT','IT Fundamentals','3(2-1)','Core'),
('IT-102','BSIT','Networking Fundamentals','3(2-1)','Core'),
('AI-301','BSCS','Artificial Intelligence','3(2-1)','Elective'),
('AI-302','BSCS','Machine Learning','3(2-1)','Elective');

-- =================================================================================================================================


INSERT INTO Semester VALUES
('2019SM','Spring 2019','2019-02-01','2019-06-30'),
('2019FM','Fall 2019','2019-09-01','2020-01-15'),
('2020SM','Spring 2020','2020-02-01','2020-06-30'),
('2020FM','Fall 2020','2020-09-01','2021-01-15'),
('2021SM','Spring 2021','2021-02-01','2021-06-30'),
('2021FM','Fall 2021','2021-09-01','2022-01-15'),
('2022SM','Spring 2022','2022-02-01','2022-06-30'),
('2022FM','Fall 2022','2022-09-01','2023-01-15'),
('2023SM','Spring 2023','2023-02-01','2023-06-30'),
('2023FM','Fall 2023','2023-09-01','2024-01-15');

INSERT INTO CourseEnrollS VALUES
('BIIT007', '2022-ARID-007', 'SE-101', 'BSSE', '2022SM', 'A', 8.00, 10.50, 7.50, 14.00, 9.50, '1', 'B'),
('BIIT008', '2022-ARID-008', 'SE-202', 'BSSE', '2022FM', 'B', 6.25, 8.75, 6.00, 11.50, 7.50, '1', 'C'),
('BIIT009', '2021-ARID-009', 'IT-101', 'BSIT', '2021SM', 'C', 9.25, 11.50, 8.75, 15.50, 10.75, '1', 'A'),
('BIIT010', '2021-ARID-010', 'AI-301', 'BSCS', '2021FM', 'A', 7.75, 10.00, 7.50, 13.50, 9.25, '1', 'B'),
('BIIT001', '2020-ARID-011', 'CS-103', 'BSCS', '2020SM', 'A', 8.25, 10.50, 7.75, 14.50, 9.75, '1', 'B'),
('BIIT002', '2020-ARID-012', 'CS-104', 'BSCS', '2020FM', 'B', 7.50, 9.75, 6.50, 13.00, 8.25, '1', 'B'),
('BIIT003', '2019-ARID-013', 'CS-203', 'BSCS', '2019SM', 'C', 6.75, 8.50, 6.25, 12.00, 7.50, '2', 'C'),

-- =================================================================================================================================


INSERT INTO Teacher (Emp_no, Emp_firstName, Emp_lastname, Emp_middlename, Gender, Status, Session, Emp_email, Designation, Evaluator)
VALUES
-- HODs
('BIIT011', 'MUNIR', 'AHMED', '', 'M', 'Active', '2025SM', 'munir@biit.edu.pk', 'HOD', 'No'),
('BIIT012', 'IRUM', 'ILYAS', '', 'F', 'Active', '2025SM', 'irum@biit.edu.pk', 'HOD', 'No'),
-- Assistant Professors (10)
('BIIT013', 'SADIA', 'AZIZ', '', 'F', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT014', 'NAVEED', 'ANWAR', '', 'M', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT015', 'ZAHID', 'IQBAL', '', 'M', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT016', 'MEHREEN', 'FATIMA', '', 'F', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT017', 'NOMAN', 'TAHIR', '', 'M', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT018', 'ASIF', 'MEHMOOD', '', 'M', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT019', 'TAYYABA', 'REHMAN', '', 'F', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT020', 'SHAHID', 'ABBAS', '', 'M', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT021', 'AREEBA', 'GUL', '', 'F', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
('BIIT022', 'FAISAL', 'JADOON', '', 'M', 'Active', '2025SM', '-', 'Assistant Professor', 'No'),
-- Junior Lecturers (10)
('BIIT023', 'HAMZA', 'YASIN', '', 'M', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT024', 'ZAINAB', 'BIBI', '', 'F', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT025', 'USMAN', 'GHANI', '', 'M', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT026', 'IQRA', 'SAHER', '', 'F', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT027', 'FAHAD', 'MUSTAFA', '', 'M', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT028', 'SANA', 'JAVED', '', 'F', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT029', 'BILAWAL', 'BHUTTO', '', 'M', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT030', 'KOMAL', 'RIZVI', '', 'F', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT031', 'ADIL', 'RASHID', '', 'M', 'Active', '2025SM', '-', 'Junior Lecturer', 'No'),
('BIIT032', 'MARYAM', 'NAWAZ', '', 'F', 'Active', '2025SM', '-', 'Junior Lecturer', 'No');

-- =================================================================================================================================



INSERT INTO Question (Question, Question_type)
VALUES
-- 10 Questions for Supervisor (FYP Related)
('Supervisor provides technical guidance relevant to the project', 'Supervisor'),
('Supervisor is available for weekly progress meetings', 'Supervisor'),
('Supervisor helps in resolving project-related bottlenecks', 'Supervisor'),
('Supervisor provides constructive feedback on project architecture', 'Supervisor'),
('Supervisor motivates the team to meet project milestones', 'Supervisor'),
('Supervisor suggests relevant tools and technologies', 'Supervisor'),
('Supervisor ensures the project meets industry standards', 'Supervisor'),
('Supervisor assists in preparing for internal presentations', 'Supervisor'),
('Supervisor reviews the implementation/code regularly', 'Supervisor'),
('Supervisor encourages innovation and independent thinking', 'Supervisor'),
-- 10 Questions for Teacher (General Course Evaluation)
('Teacher explains concepts clearly and effectively', 'Teacher'),
('Teacher is punctual and manages class time well', 'Teacher'),
('Teacher encourages active student participation', 'Teacher'),
('Teacher provides timely feedback on assessments', 'Teacher'),
('Teacher maintains a professional and respectful behavior', 'Teacher'),
('Teacher is available for consultation outside class hours', 'Teacher'),
('Teacher relates theory with practical applications', 'Teacher'),
('Teacher uses effective teaching aids (slides/whiteboard)', 'Teacher'),
('Teacher ensures the course objectives are met', 'Teacher'),
('Teacher fair in grading and evaluation', 'Teacher'),
-- 10 Questions for Course (Content & Utility)
('The course content is well-structured and logical', 'Course'),
('The course workload is manageable and balanced', 'Course'),
('Learning materials (books/notes) are easily accessible', 'Course'),
('The course improved my technical/problem-solving skills', 'Course'),
('The course objectives were clearly defined at the start', 'Course'),
('The practical/lab work complemented the theory', 'Course'),
('The course content is up-to-date with current trends', 'Course'),
('The course effectively bridges prerequisites and advanced topics', 'Course'),
('The assessment methods truly reflect the course learning', 'Course'),
('The course provides value for future professional career', 'Course'),

-- 10 Questions for Report Coordinator (FYP Documentation)
('Coordinator provides clear guidelines for report formatting', 'Report Coordinator'),
('Coordinator is responsive to documentation-related queries', 'Report Coordinator'),
('Deadlines for deliverable submissions are reasonable', 'Report Coordinator'),
('Coordinator provides helpful feedback on report drafts', 'Report Coordinator'),
('The plagiarism policy is clearly explained and enforced', 'Report Coordinator'),
('Coordinator organizes helpful briefings for FYP documentation', 'Report Coordinator'),
('The evaluation criteria for the final report are transparent', 'Report Coordinator'),
('Coordinator ensures timely communication of important notices', 'Report Coordinator'),
('The reporting process is well-organized and streamlined', 'Report Coordinator'),
('Coordinator facilitates the submission and archiving process', 'Report Coordinator');


-- =================================================================================================================================


INSERT INTO EvalStudent  VALUES
-- Teacher BIIT001, Student 2025-ARID-001, CS-101
('BIIT001', '2025-ARID-001', 'CS-101', 'BSCS', '2025SM', 'A', 11, 'Excellent', 5),
('BIIT001', '2025-ARID-001', 'CS-101', 'BSCS', '2025SM', 'A', 12, 'Good', 4),
('BIIT001', '2025-ARID-001', 'CS-101', 'BSCS', '2025SM', 'A', 13, 'Good', 4),
('BIIT001', '2025-ARID-001', 'CS-101', 'BSCS', '2025SM', 'A', 14, 'Average', 3),
('BIIT001', '2025-ARID-001', 'CS-101', 'BSCS', '2025SM', 'A', 15, 'Excellent', 5),
-- Teacher BIIT002, Student 2025-ARID-002, CS-102
('BIIT002', '2025-ARID-002', 'CS-102', 'BSCS', '2025SM', 'B', 11, 'Good', 4),
('BIIT002', '2025-ARID-002', 'CS-102', 'BSCS', '2025SM', 'B', 12, 'Good', 4),
('BIIT002', '2025-ARID-002', 'CS-102', 'BSCS', '2025SM', 'B', 13, 'Average', 3),
('BIIT002', '2025-ARID-002', 'CS-102', 'BSCS', '2025SM', 'B', 14, 'Excellent', 5),
('BIIT002', '2025-ARID-002', 'CS-102', 'BSCS', '2025SM', 'B', 15, 'Good', 4),
-- Teacher BIIT003, Student 2025-ARID-003, CS-201
('BIIT003', '2025-ARID-003', 'CS-201', 'BSCS', '2025SM', 'C', 11, 'Excellent', 5),
('BIIT003', '2025-ARID-003', 'CS-201', 'BSCS', '2025SM', 'C', 12, 'Excellent', 5),
('BIIT003', '2025-ARID-003', 'CS-201', 'BSCS', '2025SM', 'C', 13, 'Excellent', 5),
('BIIT003', '2025-ARID-003', 'CS-201', 'BSCS', '2025SM', 'C', 14, 'Good', 4),
('BIIT003', '2025-ARID-003', 'CS-201', 'BSCS', '2025SM', 'C', 15, 'Good', 4),
-- Teacher BIIT004, Student 2025-ARID-004, CS-202
('BIIT004', '2025-ARID-004', 'CS-202', 'BSCS', '2025SM', 'A', 11, 'Excellent', 5),
('BIIT004', '2025-ARID-004', 'CS-202', 'BSCS', '2025SM', 'A', 12, 'Excellent', 5),
('BIIT004', '2025-ARID-004', 'CS-202', 'BSCS', '2025SM', 'A', 13, 'Good', 4),
('BIIT004', '2025-ARID-004', 'CS-202', 'BSCS', '2025SM', 'A', 14, 'Good', 4),
('BIIT004', '2025-ARID-004', 'CS-202', 'BSCS', '2025SM', 'A', 15, 'Average', 3);


-- =================================================================================================================================


INSERT INTO CourseAllocateT (Emp_no, Course_no, Discipline, Session, Section)
VALUES
-- ===== 2025SM =====
('BIIT001', 'CS-101', 'BSCS', '2025SM', 'A'),
('BIIT002', 'CS-101', 'BSCS', '2025SM', 'B'),
('BIIT003', 'CS-101', 'BSCS', '2025SM', 'C'),

-- ===== 2024FM =====
('BIIT004', 'CS-102', 'BSCS', '2024FM', 'A'),
('BIIT005', 'CS-102', 'BSCS', '2024FM', 'B'),
('BIIT006', 'CS-102', 'BSCS', '2024FM', 'C'),

-- ===== 2023SM =====
('BIIT007', 'CS-201', 'BSCS', '2023SM', 'A'),
('BIIT008', 'CS-201', 'BSCS', '2023SM', 'B'),
('BIIT009', 'CS-201', 'BSCS', '2023SM', 'C'),

-- ===== 2022FM =====
('BIIT010', 'CS-202', 'BSCS', '2022FM', 'A'),
('BIIT001', 'CS-202', 'BSCS', '2022FM', 'B'),
('BIIT002', 'CS-202', 'BSCS', '2022FM', 'C'),

-- ===== 2021SM =====
('BIIT003', 'SE-101', 'BSSE', '2021SM', 'A'),
('BIIT004', 'SE-101', 'BSSE', '2021SM', 'B'),
('BIIT005', 'SE-101', 'BSSE', '2021SM', 'C'),

-- ===== 2018FM =====
('BIIT006', 'IT-101', 'BSIT', '2018FM', 'A'),
('BIIT007', 'IT-101', 'BSIT', '2018FM', 'B'),
('BIIT008', 'IT-101', 'BSIT', '2018FM', 'C');

-- =================================================================================================================================

-- ================== 2025-ARID-001 (BSSE) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT013','2025-ARID-001','SE-101','BSSE','2025SM','A',8.5,10,7.5,14,9.25,'1','B'),
('BIIT023','2025-ARID-001','SE-101','BSSE','2025SM','A',8.5,10,7.5,14,9.25,'1','B'),
('BIIT014','2025-ARID-001','SE-202','BSSE','2025SM','A',7.7,9.5,6.7,13,8.25,'1','B'),
('BIIT024','2025-ARID-001','SE-202','BSSE','2025SM','A',7.7,9.5,6.7,13,8.25,'1','B'),
('BIIT015','2025-ARID-001','CS-101','BSSE','2025SM','A',8.0,9.0,7.0,12,8.50,'1','B'),
('BIIT025','2025-ARID-001','CS-101','BSSE','2025SM','A',8.0,9.0,7.0,12,8.50,'1','B');
-- ================== 2025-ARID-002 (BSSE) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT002','2025-ARID-002','SE-101','BSSE','2025FM','B',7.25,9.50,6.75,12.50,8.00,'1','B'),
('BIIT004','2025-ARID-002','SE-101','BSSE','2025FM','B',7.25,9.50,6.75,12.50,8.00,'1','B'),
('BIIT001','2025-ARID-002','SE-202','BSSE','2025FM','B',6.75,8.50,6.25,11.00,7.50,'1','C'),
('BIIT003','2025-ARID-002','SE-202','BSSE','2025FM','B',6.75,8.50,6.25,11.00,7.50,'1','C'),
('BIIT005','2025-ARID-002','CS-101','BSSE','2025FM','B',8.25,10.25,7.50,14.00,9.00,'1','B'),
('BIIT006','2025-ARID-002','CS-101','BSSE','2025FM','B',8.25,10.25,7.50,14.00,9.00,'1','B');

-- ================== 2024-ARID-003 (BSCS) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT003','2024-ARID-003','CS-101','BSCS','2024SM','C',6.50,8.75,6.00,11.00,7.25,'1','C'),
('BIIT005','2024-ARID-003','CS-101','BSCS','2024SM','C',6.50,8.75,6.00,11.00,7.25,'1','C'),
('BIIT004','2024-ARID-003','CS-102','BSCS','2024SM','C',6.75,8.50,6.25,12.00,7.50,'1','C'),
('BIIT006','2024-ARID-003','CS-102','BSCS','2024SM','C',6.75,8.50,6.25,12.00,7.50,'1','C'),
('BIIT007','2024-ARID-003','CS-103','BSCS','2024SM','C',7.25,9.00,6.75,13.00,8.00,'1','B'),
('BIIT008','2024-ARID-003','CS-103','BSCS','2024SM','C',7.25,9.00,6.75,13.00,8.00,'1','B');

-- ================== 2024-ARID-004 (BSIT) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT005','2024-ARID-004','IT-101','BSIT','2024FM','B',8.25,10.25,7.50,14.00,9.00,'1','B'),
('BIIT006','2024-ARID-004','IT-101','BSIT','2024FM','B',8.25,10.25,7.50,14.00,9.00,'1','B'),
('BIIT007','2024-ARID-004','IT-102','BSIT','2024FM','B',7.50,9.75,6.50,13.00,8.25,'1','B'),
('BIIT008','2024-ARID-004','IT-102','BSIT','2024FM','B',7.50,9.75,6.50,13.00,8.25,'1','B'),
('BIIT009','2024-ARID-004','CS-201','BSIT','2024FM','B',6.75,8.50,6.25,12.00,7.50,'1','C'),
('BIIT010','2024-ARID-004','CS-201','BSIT','2024FM','B',6.75,8.50,6.25,12.00,7.50,'1','C');

-- ================== 2023-ARID-005 (BSSE) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT007','2023-ARID-005','SE-101','BSSE','2023SM','B',8.00,10.50,7.50,14.00,9.50,'1','B'),
('BIIT008','2023-ARID-005','SE-101','BSSE','2023SM','B',8.00,10.50,7.50,14.00,9.50,'1','B'),
('BIIT009','2023-ARID-005','SE-202','BSSE','2023SM','B',6.25,8.75,6.00,11.50,7.50,'1','C'),
('BIIT010','2023-ARID-005','SE-202','BSSE','2023SM','B',6.25,8.75,6.00,11.50,7.50,'1','C'),
('BIIT001','2023-ARID-005','CS-301','BSSE','2023SM','B',5.75,8.25,6.25,12.50,7.50,'1','C'),
('BIIT003','2023-ARID-005','CS-301','BSSE','2023SM','B',5.75,8.25,6.25,12.50,7.50,'1','C');


-- ================== 2022-ARID-007 (BSIT) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT001','2022-ARID-007','IT-101','BSIT','2022SM','C',9.00,11.00,8.00,15.00,10.00,'1','A'),
('BIIT002','2022-ARID-007','IT-101','BSIT','2022SM','C',9.00,11.00,8.00,15.00,10.00,'1','A'),
('BIIT003','2022-ARID-007','IT-102','BSIT','2022SM','C',8.50,10.50,7.50,14.00,9.25,'1','B'),
('BIIT004','2022-ARID-007','IT-102','BSIT','2022SM','C',8.50,10.50,7.50,14.00,9.25,'1','B'),
('BIIT005','2022-ARID-007','CS-103','BSIT','2022SM','C',7.75,9.50,6.75,13.00,8.50,'1','B'),
('BIIT006','2022-ARID-007','CS-103','BSIT','2022SM','C',7.75,9.50,6.75,13.00,8.50,'1','B'),





-- ================== 2. 2025-ARID-002 (BSSE) ==================
('BIIT014','2025-ARID-002','SE-101','BSSE','2025FM','B',7.2,9.5,6.7,12,8.00,'1','B'),
('BIIT024','2025-ARID-002','SE-101','BSSE','2025FM','B',7.2,9.5,6.7,12,8.00,'1','B'),
('BIIT013','2025-ARID-002','SE-202','BSSE','2025FM','B',6.7,8.5,6.2,11,7.50,'1','C'),
('BIIT023','2025-ARID-002','SE-202','BSSE','2025FM','B',6.7,8.5,6.2,11,7.50,'1','C');

INSERT INTO CourseEnrollS VALUES
('BIIT013','2025-ARID-002','CS-204','BSSE','2025FM','B',7.5,9.0,6.8,13,8.10,'1','B'),
('BIIT023','2025-ARID-002','CS-204','BSSE','2025FM','B',7.5,9.0,6.8,13,8.10,'1','B'),

-- CS-202 (Assistant + Junior)
('BIIT014','2025-ARID-002','CS-202','BSSE','2025FM','B',7.0,8.8,6.5,12,7.90,'1','B'),
('BIIT024','2025-ARID-002','CS-202','BSSE','2025FM','B',7.0,8.8,6.5,12,7.90,'1','B'),

-- AI-301 (Assistant + Junior)
('BIIT013','2025-ARID-002','AI-301','BSSE','2025FM','B',8.0,9.2,7.0,14,8.50,'1','A'),
('BIIT023','2025-ARID-002','AI-301','BSSE','2025FM','B',8.0,9.2,7.0,14,8.50,'1','A');
-- ================== 3. 2024-ARID-003 (BSCS) ==================
INSERT INTO CourseEnrollS VALUES
('BIIT015','2024-ARID-003','CS-101','BSCS','2024SM','C',6.5,8.7,6.0,11,7.25,'1','C'),
('BIIT025','2024-ARID-003','CS-101','BSCS','2024SM','C',6.5,8.7,6.0,11,7.25,'1','C'),
('BIIT016','2024-ARID-003','CS-103','BSCS','2024SM','C',7.2,9.0,6.7,13,8.00,'1','B'),
('BIIT026','2024-ARID-003','CS-103','BSCS','2024SM','C',7.2,9.0,6.7,13,8.00,'1','B'),

-- ================== 4. 2024-ARID-004 (BSIT) ==================
('BIIT015','2024-ARID-004','IT-101','BSIT','2024FM','B',8.2,10.2,7.5,14,9.00,'1','B'),
('BIIT025','2024-ARID-004','IT-101','BSIT','2024FM','B',8.2,10.2,7.5,14,9.00,'1','B'),
('BIIT017','2024-ARID-004','CS-201','BSIT','2024FM','B',6.7,8.5,6.2,12,7.50,'1','C'),
('BIIT027','2024-ARID-004','CS-201','BSIT','2024FM','B',6.7,8.5,6.2,12,7.50,'1','C'),

-- ================== 5. 2023-ARID-005 (BSSE) ==================
('BIIT016','2023-ARID-005','SE-101','BSSE','2023SM','B',8.0,10.5,7.5,14,9.50,'1','B'),
('BIIT026','2023-ARID-005','SE-101','BSSE','2023SM','B',8.0,10.5,7.5,14,9.50,'1','B'),
('BIIT013','2023-ARID-005','CS-301','BSSE','2023SM','B',5.7,8.2,6.2,12,7.50,'1','C'),
('BIIT023','2023-ARID-005','CS-301','BSSE','2023SM','B',5.7,8.2,6.2,12,7.50,'1','C'),

-- ================== 6. 2023-ARID-006 (BSCS) ==================
('BIIT014','2023-ARID-006','CS-302','BSCS','2023FM','C',7.5,10.0,7.2,13,9.00,'1','B'),
('BIIT024','2023-ARID-006','CS-302','BSCS','2023FM','C',7.5,10.0,7.2,13,9.00,'1','B'),

-- ================== 7. 2022-ARID-007 (BSIT) ==================
('BIIT018','2022-ARID-007','IT-101','BSIT','2022SM','C',9.0,11.0,8.0,15,10.0,'1','A'),
('BIIT028','2022-ARID-007','IT-101','BSIT','2022SM','C',9.0,11.0,8.0,15,10.0,'1','A'),

-- ================== 8. 2022-ARID-008 (BSSE) ==================
('BIIT019','2022-ARID-008','SE-101','BSSE','2022FM','B',8.0,10.5,7.5,14,9.50,'1','B'),
('BIIT029','2022-ARID-008','SE-101','BSSE','2022FM','B',8.0,10.5,7.5,14,9.50,'1','B'),

-- ================== 9. 2021-ARID-009 (BSCS) ==================
('BIIT020','2021-ARID-009','CS-101','BSCS','2021SM','C',8.5,10.5,7.7,14,9.75,'1','B'),
('BIIT030','2021-ARID-009','CS-101','BSCS','2021SM','C',8.5,10.5,7.7,14,9.75,'1','B'),

-- ================== 10. 2021-ARID-010 (BSIT) ==================
('BIIT021','2021-ARID-010','IT-101','BSIT','2021FM','A',9.0,11.0,8.0,15,10.0,'1','A'),
('BIIT031','2021-ARID-010','IT-101','BSIT','2021FM','A',9.0,11.0,8.0,15,10.0,'1','A'),

-- ================== 11. 2020-ARID-011 (BSCS) ==================
('BIIT022','2020-ARID-011','CS-101','BSCS','2020SM','A',8.5,10.5,7.7,14,9.75,'1','B'),
('BIIT032','2020-ARID-011','CS-101','BSCS','2020SM','A',8.5,10.5,7.7,14,9.75,'1','B'),

-- ================== 12. 2020-ARID-012 (BSIT) ==================
('BIIT013','2020-ARID-012','IT-101','BSIT','2020FM','B',9.0,11.0,8.0,15,10.0,'1','A'),
('BIIT023','2020-ARID-012','IT-101','BSIT','2020FM','B',9.0,11.0,8.0,15,10.0,'1','A');

-- ================== 13. 2019-ARID-013 (BSSE) ==================

INSERT INTO CourseEnrollS VALUES
('BIIT019','2019-ARID-013','SE-101','BSSE','2019SM','C',9.2,11.5,8.7,15,10.7,'1','A'), -- SE-101 Asst
('BIIT029','2019-ARID-013','SE-101','BSSE','2019SM','C',9.2,11.5,8.7,15,10.7,'1','A'), -- SE-101 Junior
('BIIT020','2019-ARID-013','SE-202','BSSE','2019SM','C',8.5,10.5,8.0,14,9.50,'1','B'), -- SE-202 Asst
('BIIT030','2019-ARID-013','SE-202','BSSE','2019SM','C',8.5,10.5,8.0,14,9.50,'1','B'), -- SE-202 Junior
('BIIT021','2019-ARID-013','CS-201','BSSE','2019SM','C',7.8,9.0,7.2,13,8.40,'1','B'), -- CS-201 Asst
('BIIT031','2019-ARID-013','CS-201','BSSE','2019SM','C',7.8,9.0,7.2,13,8.40,'1','B'), -- CS-201 Junior

-- ================== 14. 2019-ARID-014 (BSCS) ==================
('BIIT015','2019-ARID-014','CS-101','BSCS','2019FM','A',9.2,11.5,8.7,15,10.7,'1','A'),
('BIIT025','2019-ARID-014','CS-101','BSCS','2019FM','A',9.2,11.5,8.7,15,10.7,'1','A');

-- ================== 15. 2018-ARID-015 (BSIT) ==================

INSERT INTO CourseEnrollS VALUES
('BIIT015','2018-ARID-015','IT-101','BSIT','2018SM','A',9.5,11.7,9.0,16,11.0,'1','A'),
('BIIT025','2018-ARID-015','IT-101','BSIT','2018SM','A',9.5,11.7,9.0,16,11.0,'1','A'),
('BIIT016','2018-ARID-015','IT-102','BSIT','2018SM','A',9.0,11.0,8.5,15,10.5,'1','A'),
('BIIT026','2018-ARID-015','IT-102','BSIT','2018SM','A',9.0,11.0,8.5,15,10.5,'1','A'),
('BIIT017','2018-ARID-015','CS-201','BSIT','2018SM','A',8.2,9.8,7.5,14,9.20,'1','B'),
('BIIT027','2018-ARID-015','CS-201','BSIT','2018SM','A',8.2,9.8,7.5,14,9.20,'1','B'),

-- ================== 16. 2018-ARID-016 (BSSE) ==================
('BIIT017','2018-ARID-016','SE-101','BSSE','2018FM','B',8.2,10.2,7.5,14,9.00,'1','B'),
('BIIT027','2018-ARID-016','SE-101','BSSE','2018FM','B',8.2,10.2,7.5,14,9.00,'1','B');

-- ================== Additional Subjects for 2018-ARID-016 ==================

INSERT INTO CourseEnrollS VALUES
-- SE-202 (Assistant + Junior)
('BIIT018','2018-ARID-016','SE-202','BSSE','2018FM','B',7.8,9.8,7.0,13,8.60,'1','B'),
('BIIT028','2018-ARID-016','SE-202','BSSE','2018FM','B',7.8,9.8,7.0,13,8.60,'1','B'),

-- CS-204 (Assistant + Junior)
('BIIT019','2018-ARID-016','CS-204','BSSE','2018FM','B',8.5,10.5,7.8,15,9.20,'1','A'),
('BIIT029','2018-ARID-016','CS-204','BSSE','2018FM','B',8.5,10.5,7.8,15,9.20,'1','A'),

-- CS-202 (Assistant + Junior)
('BIIT020','2018-ARID-016','CS-202','BSSE','2018FM','B',7.2,9.0,6.8,12,8.10,'1','B'),
('BIIT030','2018-ARID-016','CS-202','BSSE','2018FM','B',7.2,9.0,6.8,12,8.10,'1','B');


-- =================================================================================================================================


INSERT INTO CourseAllocateT (Emp_no, Course_no, Discipline, Session, Section)
VALUES
-- ===== 2025SM (Mixed Assistant Profs & Junior Lecturers) =====
('BIIT013', 'CS-101', 'BSCS', '2025SM', 'A'), -- Asst. Prof
('BIIT023', 'CS-101', 'BSCS', '2025SM', 'B'), -- Junior Lec
('BIIT014', 'CS-101', 'BSCS', '2025SM', 'C'), -- Asst. Prof

-- ===== 2024FM =====
('BIIT024', 'CS-102', 'BSCS', '2024FM', 'A'), -- Junior Lec
('BIIT015', 'CS-102', 'BSCS', '2024FM', 'B'), -- Asst. Prof
('BIIT025', 'CS-102', 'BSCS', '2024FM', 'C'), -- Junior Lec

-- ===== 2023SM =====
('BIIT016', 'CS-201', 'BSCS', '2023SM', 'A'), -- Asst. Prof
('BIIT026', 'CS-201', 'BSCS', '2023SM', 'B'), -- Junior Lec
('BIIT017', 'CS-201', 'BSCS', '2023SM', 'C'), -- Asst. Prof

-- ===== 2022FM =====
('BIIT027', 'CS-202', 'BSCS', '2022FM', 'A'), -- Junior Lec
('BIIT018', 'CS-202', 'BSCS', '2022FM', 'B'), -- Asst. Prof
('BIIT028', 'CS-202', 'BSCS', '2022FM', 'C'), -- Junior Lec

-- ===== 2021SM =====
('BIIT019', 'SE-101', 'BSSE', '2021SM', 'A'), -- Asst. Prof
('BIIT029', 'SE-101', 'BSSE', '2021SM', 'B'), -- Junior Lec
('BIIT020', 'SE-101', 'BSSE', '2021SM', 'C'), -- Asst. Prof

-- ===== 2018FM =====
('BIIT030', 'IT-101', 'BSIT', '2018FM', 'A'), -- Junior Lec
('BIIT021', 'IT-101', 'BSIT', '2018FM', 'B'), -- Asst. Prof
('BIIT031', 'IT-101', 'BSIT', '2018FM', 'C'); -- Junior Lec

-- =================================================================================================================================

select * from Login;
select * from Student;
select * from Course;
select * from Semester;
select * from CourseEnrollS;
select * from Teacher;
select * from Question;
select * from EvalStudent;
select * from CourseAllocateT

ALTER TABLE Teacher
ADD Designation VARCHAR(20);

ALTER TABLE Login
DROP COLUMN semester;


USE Teacher_Evaluation_System;
GO

ALTER ROLE db_owner 
ADD MEMBER [IIS APPPOOL\DefaultAppPool];
GO

SELECT *
FROM CourseEnrollS where Reg_no='2025-ARID-001'
ORDER BY Reg_no;


SELECT Reg_no, Course_no, Emp_firstName, Designation 
FROM CourseEnrollS 
JOIN Teacher ON CourseEnrollS.Emp_no = Teacher.Emp_no
ORDER BY Reg_no;


SELECT *
FROM CourseEnrollS where Course_no='CS-101'
ORDER BY Reg_no;

delete CourseEnrollS


-- Assigning 4.0 to the Semester 1 top student
UPDATE Student 
SET cgpa = 4.0, grade = 'A+' 
WHERE Reg_no = '2025-ARID-002';

-- Assigning 3.94 to the Semester 8 top student
UPDATE Student 
SET cgpa = 3.94, grade = 'A' 
WHERE Reg_no = '2018-ARID-016';

-- Assigning 3.87 to the other Semester 8 student
UPDATE Student 
SET cgpa = 3.87, grade = 'A' 
WHERE Reg_no = '2018-ARID-015';