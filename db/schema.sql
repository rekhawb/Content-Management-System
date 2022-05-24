DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE  DEPARTMENT (
    DEPT_ID INT NOT NULL AUTO_INCREMENT,
    DEPT_NAME VARCHAR(30),
    PRIMARY KEY (DEPT_ID)
)ENGINE=InnoDB AUTO_INCREMENT=1000;

CREATE TABLE EMP_ROLE (
 
 ROLE_ID INT NOT NULL AUTO_INCREMENT,
 DEPT_ID INT,
 TITLE VARCHAR(30),
 SALARY DECIMAL,
 PRIMARY KEY (ROLE_ID),
 FOREIGN KEY (DEPT_ID)
 REFERENCES DEPARTMENT(DEPT_ID)
 ON DELETE SET NULL
)ENGINE=InnoDB AUTO_INCREMENT=100;

CREATE TABLE EMPLOYEE (
EMP_ID INT NOT NULL AUTO_INCREMENT,
ROLE_ID INT,
FIRST_NAME VARCHAR(30),
LAST_NAME VARCHAR(30),
MANAGER_ID INT,
PRIMARY KEY (EMP_ID),
FOREIGN KEY (ROLE_ID)
REFERENCES EMP_ROLE (ROLE_ID)
ON DELETE SET NULL


)ENGINE=InnoDB AUTO_INCREMENT=1;

