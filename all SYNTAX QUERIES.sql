--ALL QUERIES SYNTAX

select AVG(Answer_Marks) from Eval where  Reg_No='2022-ARID-4044' and Emp_no='BIIT193'

DELETE FROM Question_Answer 
WHERE Question_ID BETWEEN 56 AND 71;

Got it — you want a **complete SQL syntax guide (basic → advanced)**. I’ll keep it structured so you can revise for exams or interviews easily.

---

# 🔰 1. BASIC SQL SYNTAX

### 📌 Create Database

```sql
CREATE DATABASE db_name;
```

### 📌 Use Database

```sql
USE db_name;
```

### 📌 Create Table

```sql
CREATE TABLE table_name (
    column1 datatype PRIMARY KEY,
    column2 datatype,
    column3 datatype
);
```

### 📌 Insert Data

```sql
INSERT INTO table_name (col1, col2)
VALUES (value1, value2);
```

### 📌 Select Data

```sql
SELECT * FROM table_name;
```

```sql
SELECT col1, col2 FROM table_name;
```

### 📌 Where Clause

```sql
SELECT * FROM table_name
WHERE condition;
```

---

# 🔹 2. FILTERING & CONDITIONS

### Operators

```sql
=, !=, >, <, >=, <=
```

### AND / OR / NOT

```sql
SELECT * FROM table_name
WHERE col1 = 'A' AND col2 > 10;
```

### BETWEEN

```sql
SELECT * FROM table_name
WHERE col BETWEEN 10 AND 20;
```

### IN

```sql
SELECT * FROM table_name
WHERE col IN ('A', 'B', 'C');
```

### LIKE

```sql
SELECT * FROM table_name
WHERE name LIKE 'A%';
```

---

# 🔹 3. SORTING & LIMIT

### ORDER BY

```sql
SELECT * FROM table_name
ORDER BY col ASC;
```

### LIMIT

```sql
SELECT * FROM table_name
LIMIT 5;
```

---

# 🔹 4. UPDATE & DELETE

### Update

```sql
UPDATE table_name
SET col1 = value
WHERE condition;
```

### Delete

```sql
DELETE FROM table_name
WHERE condition;
```

---

# 🔹 5. ALTER TABLE

### Add Column

```sql
ALTER TABLE table_name
ADD column_name datatype;
```

### Drop Column

```sql
ALTER TABLE table_name
DROP COLUMN column_name;
```

---

# 🔹 6. AGGREGATE FUNCTIONS

```sql
SELECT COUNT(*) FROM table_name;
SELECT SUM(col) FROM table_name;
SELECT AVG(col) FROM table_name;
SELECT MAX(col) FROM table_name;
SELECT MIN(col) FROM table_name;
```

---

# 🔹 7. GROUP BY & HAVING

```sql
SELECT col, COUNT(*)
FROM table_name
GROUP BY col;
```

```sql
SELECT col, COUNT(*)
FROM table_name
GROUP BY col
HAVING COUNT(*) > 5;
```

---

# 🔹 8. JOINS (VERY IMPORTANT 🔥)

### INNER JOIN

```sql
SELECT *
FROM A
INNER JOIN B ON A.id = B.id;
```

### LEFT JOIN

```sql
SELECT *
FROM A
LEFT JOIN B ON A.id = B.id;
```

### RIGHT JOIN

```sql
SELECT *
FROM A
RIGHT JOIN B ON A.id = B.id;
```

### FULL JOIN

```sql
SELECT *
FROM A
FULL JOIN B ON A.id = B.id;
```

---

# 🔹 9. SUBQUERIES

```sql
SELECT * FROM table_name
WHERE col = (SELECT MAX(col) FROM table_name);
```

---

# 🔹 10. VIEWS

```sql
CREATE VIEW view_name AS
SELECT col1, col2 FROM table_name;
```

```sql
SELECT * FROM view_name;
```

---

# 🔹 11. INDEXES

```sql
CREATE INDEX idx_name
ON table_name (column_name);
```

---

# 🔹 12. CONSTRAINTS

```sql
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
CHECK
DEFAULT
```

Example:

```sql
CREATE TABLE Orders (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
```

---

# 🔹 13. STORED PROCEDURES (ADVANCE 🔥)

```sql
CREATE PROCEDURE proc_name
AS
BEGIN
    SELECT * FROM table_name;
END;
```

Execute:

```sql
EXEC proc_name;
```

---

# 🔹 14. VARIABLES

```sql
DECLARE @var INT;
SET @var = 10;
```

---

# 🔹 15. IF ELSE

```sql
IF (@var > 5)
BEGIN
    PRINT 'Greater';
END
ELSE
BEGIN
    PRINT 'Smaller';
END
```

---

# 🔹 16. LOOPS

### WHILE Loop

```sql
DECLARE @i INT = 1;

WHILE @i <= 5
BEGIN
    PRINT @i;
    SET @i = @i + 1;
END;
```

---

# 🔹 17. FUNCTIONS

```sql
CREATE FUNCTION func_name (@num INT)
RETURNS INT
AS
BEGIN
    RETURN @num * 2;
END;
```

---

# 🔹 18. TRIGGERS

```sql
CREATE TRIGGER trg_name
ON table_name
AFTER INSERT
AS
BEGIN
    PRINT 'Data Inserted';
END;
```

---

# 🔹 19. TRANSACTIONS

```sql
BEGIN TRANSACTION;

UPDATE table_name SET col = value;

COMMIT;
-- or
ROLLBACK;
```

---



