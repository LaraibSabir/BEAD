create database testing;
use testing;

Create table conQuestion_Answer (
Question_ID int Primary KEy IDENTITY(1,1) not Null,
Question nvarchar(max) null,
Description varchar(30) null
)
INSERT INTO conQuestion_Answer (Question, Description)
VALUES 
('Knowledge of this teacher about the subject? (Has he/she a thorough knowledge and understanding of the subject being taught?)', 'T'),
('Ability of this teacher to explain concepts clearly. (Are explanations of concepts, questions and assignments clear and precise?)', 'T'),
('Is the teacher fair and impartial in treatment of all students?', 'T'),
('Ability of this teacher to maintain good discipline. (Does he/she keep good control of the class without being harsh? Is he/she firm but fair?)', 'T'),
('Is the teacher friendly, considerate, patient and helpful? (Not getting irritated by questions in class, answers all queries)', 'T'),
('Is the teacher audible to the whole class, especially to the last rows? (Can the students in the back rows hear the teacher''s voice)', 'T'),
('Does the teacher have "The ability" to make classes interesting? (Does he/she show enthusiasm and a sense of humor? Does he/she vary teaching procedures?)', 'T'),
('Does the teacher use white boards extensively to write definitions, draw diagrams, show and solve problems and examples.', 'T'),
('Does the teacher involve the students during lecture? (Are students'' ideas and opinions worth something in this class? Do students help to solve problems?)', 'T'),
('Does the teacher arrive on time? (i.e. in a class of 60 minutes he/she teaches 50 minutes, which includes quizzes)', 'T'),
('Has the teacher completed the whole course, as per course outline (This Question is Only for Teachers of the course, NOT Junior Lecturers conducting the Lab)?', 'T'),
('Does the teacher provide lecture material apart from the textbook? (Such as handouts, lesson plans etc. This Question is Only for Teachers, NOT Junior Lecturers.)', 'T'),
('Does the teacher return graded papers and quizzes in a reasonable amount of time? (This Question is Only for Teachers of the course, NOT Junior Lecturers.)', 'T'),
('Was the teacher available and helpful during the specified office hours and after class consultations (for various queries and problems)', 'T'),
('The general (all-round) teaching ability of this teacher? (All factors considered, how close does this teacher come to your ideal?)', 'T'),
('Have you ever observed this teacher accepting gifts/favors from students?', 'E'),
('Have you ever observed an intention from this teacher about changing grades in courses with any sort of favors/gifts/incentives?', 'E'),
('Have you ever observed any discrimination in this teacher''s behavior and grading of courses based on Gender, Ethnicity or Race?', 'E'),
('Have you ever experienced any harassment towards you from this teacher? Or towards another student in class?', 'E');

select * from conQuestion_Answer

CREATE TABLE conEval (
    EvalID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Emp_no CHAR(7) NOT NULL,
    Reg_No NVARCHAR(50) NOT NULL,
    Course_no VARCHAR(9) NOT NULL,
    Discipline varchar(20) not null,
    Semester_no NVARCHAR(100) NOT NULL,
    Question_Desc int NOT NULL,
    Answer_Desc NVARCHAR(50) NULL,
    Answer_Marks INT NULL,
    -- BIT is the standard way to handle Yes/No (Boolean) checkboxes
    Answer_YN BIT NULL, 
    Suggestion VARCHAR(MAX) NULL,
    St_Email NVARCHAR(50) NOT NULL
);
select * from conEval

delete from conEval where St_Email='aridno@biit.edu.pk'