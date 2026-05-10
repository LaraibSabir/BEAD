


ALTER TABLE ClassReports
ALTER COLUMN Emp_no CHAR(7) NOT NULL;

UPDATE ClassReports
SET LateIn = ''
WHERE Emp_no = 'BIIT429';

-- 1. Drop the constraint first (using the name from your error message)
ALTER TABLE EMPMTR 
DROP CONSTRAINT DF__EMPMTR__Eval__4D5F7D71;

-- 2. Now you can safely drop the column
ALTER TABLE EMPMTR 
DROP COLUMN Eval;

-- 3. Re-add it as an INT so your C# code (t.Eval = 0) works
ALTER TABLE EMPMTR 
ADD Eval INT DEFAULT 0;



ALTER TABLE Log_In
ALTER COLUMN User_name VARCHAR(100);
ALTER TABLE EMPMTR 
ADD eval INT DEFAULT 0;
 INSERT INTO Log_In (User_name,User_id, User_type,User_password)
SELECT     
    Name,  Emp_no, 'Teacher', '123' 
FROM EMPMTR
WHERE Emp_no NOT IN (SELECT User_id FROM Log_In);


SELECT * from Log_In where User_id='2022-ARID-4044'
SELECT * FROM Crsdtl where REG_NO='2025-ARID-0273';
select * from Eval  where Reg_No='2022-ARID-4044'
select * from CRSMTR where Course_no='';
select * from EMPMTR where USERID='Beenish';
SELECT * from Log_In where User_id='BIIT400';
select * from Question_Answer
select * from STMTR  where Reg_No='2021-ARID-0168'
select * from STMTR  where Reg_No='2020-ARID-3594'
select distinct(SOS) from CRSMTR
select * from Accgpa where Reg_No='2020-ARID-3594';

select * from STMTR  where St_firstname='Ahmed'
select * from STMTR where SOS='SOS2020S'
select * from ALLOCATE where EMP_NO='BIIT101'
order by EMP_NO asc;
select * from AttendanceRecords;
select * from ClassReports;
-- 2. Add 'IsActive' column to support soft deletes/versioning



CREATE TABLE PeerEvaluation (
    EvalID INT PRIMARY KEY IDENTITY(1,1), 
    Evaluator_Emp_no CHAR(7) NOT NULL,    
    Target_Emp_no CHAR(7) NOT NULL,       
    Question_Desc INT NOT NULL,           -- Matches your Eval table
    Answer_Desc NVARCHAR(50) NULL,        -- Matches your Eval table
    Answer_Marks INT NULL,
    Remarks NVARCHAR(MAX) NULL,
);
select * from Eval 
select * from PeerEvaluation
select AVG(Answer_Marks) from Eval where  Reg_No='2022-ARID-4044' and Emp_no='BIIT193'


select * from ClassReports where Emp_no='BIIT187'
ALTER TABLE Question_Answer 
ADD Updated_Question NVARCHAR(MAX) NULL;
ALTER TABLE Question_Answer 
ADD IsActive BIT DEFAULT 1;
SELECT TOP 10 * FROM STMTR
SELECT TOP 10 * FROM Eval


SELECT * FROM Question_Answer WHERE Question_ID = 81;
SELECT 
    Question_ID,
    ISNULL(Updated_Question, Question) AS DisplayQuestion
FROM Question_Answer
WHERE IsActive = 1;

select * from Log_In 
 
insert into Log_In   (USER_NAME,USER_ID,User_type,User_password)  values  ('Muhammad Nadeem','BIIT000','Admin','123')
SELECT * 
FROM STMTR 
WHERE Reg_No LIKE '2022-ARID-%';


UPDATE Log_In
SET User_type = 'Teacher'
WHERE User_id = 'BIIT000';


UPDATE EMPMTR
SET Designation = 'Director'
WHERE Emp_no = 'BIIT156';

insert into EMPMTR (Emp_no,Emp_email,USERID,Password,Designation,Name,Eval) values ('BIIT000','Nadeem@biit.edu.pk','Nadeem','123','Admin','Muhammad Nadeem',0)

