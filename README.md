## About this project 
this is a web appoilication in which student and teacher can book and schedule appointment and student can send message to teacher.
this is a full stack project which includes both frontend and backend
for backend i used node.js, express.js and MySql for database

## database details
this project's database curently uses 7 no. of tables in it's database 

for testing you need to run backend code first, it will create database required in this project with all the tables.

database name : stba
tables : login,student,teacher,appointment,registration request ,scheduled appointment, and student message table are the tables

once the tables are created in database make sure to add admin details in login table like username,password,email and description = "admin" manually in table.

## how to run project 
1. open 2 terminals in code editor 1 for backend and other for frontend.
2. in 1st terminals go to path of backend directory and then run 'npm start' command.
3. in 2nd terminals go to path of student-teacher directory and then run 'npm start' command.

then you can be able to test this project , i tested this project mannually by myself and its working fine for me.


## working of this project
1. user authentication at login page from database login table 
2. this project has 3 types of account admin, techer, and student account
3. at admin account, admin can add teacher,update teacher detail, detele teacher, and approve or cancel student registration request with few clicks.
4. at teacher account,teacher can see messages sent by student , see all appointments request, and schedule or cancel appointment request with few clicks,
5. at student account, studnet can search for teacher ,book appointment ,and send message to teacher with fewer clicks.
6. for every actions, like approving or canceling appointment request by teacher or registration request by admin , an email is send to students given email address to noftify them about the status to there request.


## additional details
in server.js file make sure to change email and password so that email can be send 

in this code part of code :
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sswayam211@gmail.com', // Your email address
        pass: 'qwqz gytz hhfu tsqp'    // Your email password or application-specific password
    }
});

i used my email for testing 
rest of the code will be fine ,I hope.