ALTER USER 'root' @'localhost' IDENTIFIED WITH mysql_native_password BY 'teamsoftware16';


CREATE DATABASE IF NOT EXISTS myapp DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE myapp;
 
CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL,
  name varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
 
ALTER TABLE users ADD PRIMARY KEY (`id`);
ALTER TABLE users MODIFY id int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;

ALTER TABLE users ADD wins int(5);
ALTER TABLE users ADD q_time time(0);
ALTER TABLE users ADD high_score int(10);

select * from users;


