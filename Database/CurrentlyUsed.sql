

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


SELECT * from Log_In where User_id='BIIT156'
SELECT * FROM Crsdtl where REG_NO='2025-ARID-0273';
select * from Eval  where Reg_No='2022-ARID-4044'
select * from CRSMTR where Course_no='MTH-435';
select * from EMPMTR where USERID='Muhammad Ihsan'
SELECT * from Log_In where User_id='2023-ARID-4059';
select * from Question_Answer
select * from STMTR  where Reg_No='1998-ARID-0437'
select * from Accgpa where Reg_No='1998-ARID-0437';
select * from STMTR where SOS='SOS2020S'
select * from ALLOCATE 
order by EMP_NO asc;
select * from AttendanceRecords;


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


SELECT TOP 10 * FROM STMTR
SELECT TOP 10 * FROM Eval


 