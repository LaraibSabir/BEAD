Create Database BTAD;
use BTAD;
drop database BTAD;
create table user_(userid varchar(50) primary key,fullname varchar(100) not null,gender varchar(10),password varchar(200) not null,role varchar(20) not null);

select * from user_;

--Student:
create table student(aridno varchar(50) primary key,fullname varchar(100) not null,program varchar(20),section varchar(20),semester int,
image varbinary(max) null,constraint fk_student_user foreign key (aridno) references user_(userid));

select * from Student;


create table enroll(enrollid int primary key,aridno varchar(50),teacherid varchar(50),coursecode varchar(100),semester int,section varchar(50),
foreign key (teacherid) references teacher(teacherid),foreign key (coursecode) references courses(coursecode),foreign key (aridno) references student(aridno)
);
Select * from enroll;

create table courses (coursecode varchar(100) primary key,coursename varchar(100),credithours int);

select * from courses;

create table sections (sectionid int identity primary key,sectionname varchar(50), program varchar(100),semester int,createdat datetime);

Select* from sections;
----------------------------------------------------------------------------------------------------------------------------------------

--Teacher
create table teacher( teacherid varchar(50) primary key,fullname varchar(100) not null,designation varchar(50),specialization varchar(100),evaluator bit,email varchar(100),
image varbinary(max) null,constraint fk_teacher_user foreign key (teacherid) references user_(userid));

select * from teacher;

create table teachercourses(id int identity primary key,teacherid varchar(50),coursecode varchar(100),section varchar(50),semester int,
 foreign key (teacherid) references teacher(teacherid),foreign key (coursecode) references courses(coursecode));

select * from teachercourses;

create table attendance(attendanceid int primary key,date date,day varchar(50),timein time,timeout time,status varchar(50),dailyhours int,
comments varchar(50),teacherid varchar(50),foreign key (teacherid) references teacher(teacherid));

select * from attendance;

create table teacher_performance (performanceid int identity primary key,teacherid varchar(50),coursecode varchar(100),semester int,
studentscore decimal(5,2),peerscore decimal(5,2),adminscore decimal(5,2), 
overallpercentage as ((studentscore + peerscore + adminscore) / 3) persisted,
createdat datetime ,foreign key (teacherid) references teacher(teacherid),foreign key (coursecode) references courses(coursecode));

Select* from teacher_performance;

create table chr(chrid int identity primary key,teacherid varchar(50),coursecode varchar(100),date date,status varchar(20),
comments varchar(500),foreign key (teacherid) references teacher(teacherid),foreign key (coursecode) references courses(coursecode));

Select* from  chr;


----------------------------------------------------------------------------------------------------------------------------------------
--Evaluators:
create table peerevaluator(peerid int identity primary key, teacaherName varchar(100));

Select* from  peerevaluator;

create table hod(hodid int identity primary key,hodName varchar(20));
Select* from  hod;

create table peerassignments(assignmentid int identity primary key,teacherid varchar(50),peerid int,hodid int,createdat datetime,
foreign key (teacherid) references teacher(teacherid),foreign key (peerid) references peerevaluator(peerid),foreign key (hodid) references hod(hodid));
Select* from  peerassignments;

----------------------------------------------------------------------------------------------------------------------------------------
--Evaluation Details:
create table evalquestions (questionid int identity primary key,questiontext varchar(300),evaltype varchar(20)
);

Select* from  evalquestions;

create table evaluationanswers (answerid int identity primary key,responseid int,questionid int,rating int,
foreign key (responseid) references evaluationresponses(responseid),foreign key (questionid) references evalquestions(questionid));

Select* from  evaluationanswers;

create table evaluationresponses(responseid int identity primary key,aridno varchar(50) null,teacherid varchar(50) not null,coursecode varchar(100),
evaltype varchar(20),comment varchar(500),createdat datetime default getdate(),foreign key (aridno) references student(aridno),
foreign key (teacherid) references teacher(teacherid),foreign key (coursecode) references courses(coursecode));

Select* from  evaluationresponses;

CREATE TABLE Evaluation_Status(Id INT IDENTITY(1,1) PRIMARY KEY,AridNo VARCHAR(50),CourseCode varchar(100),IsEvaluated BIT DEFAULT 0,
 Status VARCHAR(100) ,Remarks VARCHAR(255),LastUpdated DATETIME DEFAULT GETDATE(),
 FOREIGN KEY (AridNo) REFERENCES Student(AridNo),FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode)); 

Select* from  evaluation_status;

----------------------------------------------------------------------------------------------------------------------------------------
--Slots:
create table slots(slotid int identity primary key,date date,day varchar(20),starttime time,endtime time);

Select* from  slots;



----------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO User_ (UserId, FullName, Gender, Password, Role) VALUES
('2022-Arid-4278', 'Ali Raza', 'Male', 'Ali@123', 'Student'),
('2022-Arid-4279', 'Mahnoor Fatime', 'Female', 'Fatima@123', 'Student'),
('2022-Arid-4280', 'Ahmed Khan', 'Male', 'Khan@123', 'Student'),
('2022-Arid-4281', 'Qudaisa Noor', 'Female', 'Noor@123', 'Student'),
('2022-Arid-4282', 'Hashim Kardar', 'Male', 'Kardar@123', 'Student'),
('munir@biit.edu.pk', 'Dr.Munir', 'Male', 'drmunir@123', 'HOD'),
('irum@biit.edu.pk', 'Dr.Irum Illyas', 'Female', 'drirum@123', 'HOD'),
('zahida@biit.edu.pk', 'Mrs.Zahida', 'FeMale', 'zahida@123', 'Teacher'),
('sadaf@biit.edu.pk', 'Dr.Sadaf', 'Female', 'sadaf@123', 'Teacher'),
('muhammad@biit.edu.pk', 'Mr.Muhammad Noman', 'Male', 'noman@123', 'Teacher');

----------------------------------------------------------------------------------------------------------------------------------------
insert into student (aridno, fullname, program, section, semester, image) values
('2022-Arid-4278','Ali raza','bscs','a',5,null),
('2022-Arid-4279','Mahnoor fatime','bscs','a',5,null),
('2022-Arid-4280','Ahmed khan','bscs','b',5,null),
('2022-Arid-4281','Qudaisa noor','bsit','a',3,null),
('2022-Arid-4282','Hashim kardar','bsit','b',3,null);


insert into courses(coursecode ,coursename,credithours) values
('cs101','Programming',3),
('cs102','OOP',3),
('cs201','Database',3),
('cs202','Networks',3),
('cs301','Ai',3),
('cs302','TOQ',1),
('cs303','ML',3),
('cs304','Security',3),
('cs305','Testing',3),
('cs306','IMT',2);

insert into sections (sectionname, program, semester) values
('a','bscs',1),
('b','bscs',1),
('a','bscs',3),
('b','bscs',3),
('a','bscs',5),
('b','bscs',5),
('a','bsit',1),
('b','bsit',1),
('a','bsit',3),
('b','bsit',3);

insert into enroll (enrollid, aridno, teacherid, coursecode, semester, section) values
(1,'2022-Arid-4278','muhammad@biit.edu.pk','cs201',5,'a'),
(2,'2022-Arid-4279','zahida@biit.edu.pk','cs102',5,'a');



----------------------------------------------------------------------------------------------------------------------------------------

insert into teacher(teacherid, fullname, designation, specialization, evaluator, email, image) values
('irum@biit.edu.pk','Dr Irum Illyas','HOD','Database',1,'irum@biit.edu.pk',null),
('muhammad@biit.edu.pk','Mr Muhammad Nouman','Lecturer','OOP',1,'muhammad@biit.edu.pk',null),
('zahida@biit.edu.pk','Mrs Zahida','Lecturer','AI',0,'zahida@biit.edu.pk',null),
('sadaf@biit.edu.pk','Dr Sadaf','Assistant Professor','Networks',1,'sadaf@biit.edu.pk',null),
('munir@biit.edu.pk','Dr Munir','Professor','Web',1,'munir@biit.edu.pk',null);


insert into teachercourses(teacherid, coursecode, section, semester) values
('muhammad@biit.edu.pk','cs201','a',5),
('zahida@biit.edu.pk','cs102','a',5),
('sadaf@biit.edu.pk','cs301','b',6),
('irum@biit.edu.pk','cs202','a',5),
('munir@biit.edu.pk','cs302','c',6),
('muhammad@biit.edu.pk','cs303','a',7),
('zahida@biit.edu.pk','cs101','b',1),
('sadaf@biit.edu.pk','cs304','c',7),
('irum@biit.edu.pk','cs305','a',8),
('munir@biit.edu.pk','cs306','b',8);


insert into chr (teacherid, coursecode, date, status, comments) values
('muhammad@biit.edu.pk','cs201','2025-01-10','on time','lecture conducted smoothly'),
('zahida@biit.edu.pk','cs102','2025-01-10','late','arrived 10 minutes late'),
('sadaf@biit.edu.pk','cs301','2025-01-11','on time','completed full syllabus'),
('irum@biit.edu.pk','cs202','2025-01-11','absent','medical leave'),
('munir@biit.edu.pk','cs302','2025-01-12','on time','interactive session'),
('muhammad@biit.edu.pk','cs303','2025-01-13','late','network issue'),
('zahida@biit.edu.pk','cs101','2025-01-13','on time','students were attentive'),
('sadaf@biit.edu.pk','cs304','2025-01-14','on time','lab work completed'),
('irum@biit.edu.pk','cs305','2025-01-14','late','class started late'),
('munir@biit.edu.pk','cs306','2025-01-15','on time','covered planned topics');


insert into attendance(attendanceid, date, day, timein, timeout, status, dailyhours, comments, teacherid) values
(1,'2025-01-10','monday','09:00','12:00','present',3,'regular class','muhammad@biit.edu.pk'),
(2,'2025-01-10','monday','10:00','13:00','present',3,'lab session','zahida@biit.edu.pk'),
(3,'2025-01-11','tuesday','09:15','12:15','late',3,'late arrival','sadaf@biit.edu.pk'),
(4,'2025-01-11','tuesday','00:00','00:00','absent',0,'on leave','irum@biit.edu.pk'),
(5,'2025-01-12','wednesday','11:00','14:00','present',3,'guest lecture','munir@biit.edu.pk'),
(6,'2025-01-13','thursday','09:00','12:00','present',3,'normal class','muhammad@biit.edu.pk'),
(7,'2025-01-13','thursday','10:30','13:30','late',3,'traffic issue','zahida@biit.edu.pk'),
(8,'2025-01-14','friday','09:00','11:00','present',2,'short class','sadaf@biit.edu.pk'),
(9,'2025-01-14','friday','00:00','00:00','absent',0,'official duty','irum@biit.edu.pk'),
(10,'2025-01-15','saturday','11:00','14:00','present',3,'makeup class','munir@biit.edu.pk');


insert into teacher_performance(teacherid, coursecode, semester, studentscore, peerscore, adminscore) values
('muhammad@biit.edu.pk','cs201',5,85.50,88.00,90.00),
('muhammad@biit.edu.pk','cs303',7,82.00,86.50,89.00),
('zahida@biit.edu.pk','cs102',5,78.00,80.50,82.00),
('zahida@biit.edu.pk','cs101',1,75.50,79.00,81.50),
('sadaf@biit.edu.pk','cs301',6,88.00,90.50,92.00),
('sadaf@biit.edu.pk','cs304',7,84.50,87.00,89.50),
('irum@biit.edu.pk','cs202',5,80.00,83.00,85.00),
('irum@biit.edu.pk','cs305',8,77.50,81.00,83.50),
('munir@biit.edu.pk','cs302',6,90.00,92.50,94.00),
('munir@biit.edu.pk','cs306',8,86.00,88.50,91.00);


----------------------------------------------------------------------------------------------------------------------------------------
insert into hod (hodName) values
('Dr Irum Illyas'),
('dr Munir');

insert into peerevaluator (teacahername) values
('Mr ali'),
('Mr ahmad'),
('Ms sana'),
('Mr kamran'),
('Ms fatima'),
('Mr usman'),
('Ms hina'),
('Mr bilal'),
('Ms ayesha'),
('Mr faisal');


insert into peerassignments (teacherid, peerid, hodid) values
('muhammad@biit.edu.pk', 1, 1),
('zahida@biit.edu.pk', 2, 1),
('sadaf@biit.edu.pk', 3, 1),
('irum@biit.edu.pk', 4, 2),
('munir@biit.edu.pk', 5, 2),

('muhammad@biit.edu.pk', 2, 2),
('zahida@biit.edu.pk', 3, 2),
('sadaf@biit.edu.pk', 4, 2),
('irum@biit.edu.pk', 5, 1),
('munir@biit.edu.pk', 1, 1);



----------------------------------------------------------------------------------------------------------------------------------------

insert into evalquestions (questiontext, evaltype) values
('teacher explains concepts clearly','student'),
('teacher is punctual and regular','student'),
('teacher encourages student participation','student'),
('teacher is well prepared for lectures','student'),

('teacher collaborates well with colleagues','peer'),
('teacher follows academic policies','peer'),
('teacher shares knowledge with peers','peer'),

('lab instructions are clear','lab'),
('lab equipment is used effectively','lab'),
('lab sessions improve practical skills','lab');

insert into evaluationresponses(aridno, teacherid, coursecode, evaltype, comment) values
('2022-Arid-4278','muhammad@biit.edu.pk','cs201','student','teacher explains concepts clearly'),
('2022-Arid-4279','zahida@biit.edu.pk','cs102','student','lectures are well structured'),
('2022-Arid-4280','sadaf@biit.edu.pk','cs301','student','teacher is very supportive'),
('2022-Arid-4281','irum@biit.edu.pk','cs202','student','needs better time management'),
('2022-Arid-4282','munir@biit.edu.pk','cs302','student','interactive teaching style'),

(null,'muhammad@biit.edu.pk','cs303','peer','maintains good coordination with peers'),
(null,'zahida@biit.edu.pk','cs101','peer','shares teaching resources'),
(null,'sadaf@biit.edu.pk','cs304','peer','actively participates in meetings'),
('2022-Arid-4278','muhammad@biit.edu.pk','cs305','lab','lab instructions are clear'),
('2022-Arid-4279','zahida@biit.edu.pk','cs306','lab','practical sessions are helpful');


INSERT INTO evaluationanswers (responseid, questionid, rating)
SELECT 
    r.responseid,
    q.questionid,
    CASE q.evaltype
        WHEN 'student' THEN 5
        WHEN 'peer' THEN 4
        WHEN 'lab' THEN 5
    END AS rating
FROM evaluationresponses r
JOIN evalquestions q
    ON r.evaltype = q.evaltype;




insert into evaluation_status
(aridno, coursecode, isevaluated, status, remarks) values
('2022-Arid-4278','cs201',0,'Pending','evaluation not started'),
('2022-Arid-4279','cs102',1,'Completed','evaluation submitted'),
('2022-Arid-4280','cs301',0,'Pending','waiting for submission'),
('2022-Arid-4281','cs202',1,'Completed','successfully evaluated'),
('2022-Arid-4282','cs302',0,'Pending','not evaluated yet');

----------------------------------------------------------------------------------------------------------------------------------------

INSERT INTO slots (date, day, starttime, endtime) VALUES
('2025-01-10','monday','09:00:00','10:00:00'),
('2025-01-10','monday','10:00:00','11:00:00'),
('2025-01-10','monday','11:00:00','12:00:00'),
('2025-01-11','tuesday','09:00:00','10:30:00'),
('2025-01-11','tuesday','10:30:00','12:00:00'),
('2025-01-12','wednesday','09:00:00','11:00:00'),
('2025-01-12','wednesday','11:00:00','13:00:00'),
('2025-01-13','thursday','10:00:00','11:30:00'),
('2025-01-13','thursday','11:30:00','13:00:00'),
('2025-01-14','friday','09:00:00','10:30:00');


----------------------------------------------------------------------------------------------------------------------------------------

create procedure get_weighted_average
    @responseid int
as
begin
    select r.responseid,cast(sum(r.rating * 1.0) / count(r.answerid) as decimal(5,2)) as weighted_average from evaluationanswers r 
		where r.responseid = @responseid group by r.responseid;
end;

exec get_weighted_average 30;


--User:
select * from user_;
--Student:
select * from student;
select * from courses;
select * from enroll;
select * from sections;

--Teacher:
select * from Teacher;
select * from teachercourses;
select * from attendance;
select * from chr;
Select* from teacher_performance;


--Evaluators:
select * from peerassignments;
select * from peerevaluator;
select * from hod;


--Evaluation details:
select * from evalquestions;
select * from evaluationanswers;
Select* from  evaluationresponses;
select * from Evaluation_Status;

--Slots 
select * from Slots;























































----------------------------------------------------------------------------------------------------------------------------------------

CREATE VIEW GenderAnalytics AS
SELECT 
    T.TeacherId,
    AVG(CASE WHEN U.Gender = 'Male' THEN A.Rating END) AS MaleAverage,
    AVG(CASE WHEN U.Gender = 'Female' THEN A.Rating END) AS FemaleAverage
FROM EvaluationAnswers A
JOIN EvaluationResponses E ON A.ResponseId = E.ResponseId
JOIN Student S ON E.AridNo = S.AridNo
JOIN User_ U ON S.AridNo = U.UserId
JOIN Teacher T ON E.TeacherId = T.TeacherId
GROUP BY T.TeacherId;

--GenderAnalytics
SELECT * FROM GenderAnalytics;


