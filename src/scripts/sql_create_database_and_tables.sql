CREATE DATABASE IF NOT EXISTS `database_bet_alpha` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `database_bet_alpha`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `pod` (
  `id` BINARY(16),
  `name` varchar(50),
  `description` varchar(1000),
  `image` MEDIUMBLOB,
  `is_public` BOOLEAN,
  `is_require_moderator_approval_to_join` BOOLEAN,
  `timestamp_created` TIMESTAMP,
  `id__user_created` BINARY(16),
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `stamp` (
  `id` BINARY(16),
  `name` varchar(50),
  `description` varchar(1000),
  `image` MEDIUMBLOB,
  `timestamp_created` TIMESTAMP,
  `id__user_created` BINARY(16),
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `task` (
  `id` BINARY(16) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image` MEDIUMBLOB DEFAULT NULL,
  `number_of_points` INT NOT NULL,
  `timestamp_created` INT NOT NULL,
  `timestamp_updated` INT DEFAULT NULL,
  `timestamp_targeted` INT DEFAULT NULL,
  `id__pod` BINARY(16) DEFAULT NULL,
  `id__user_created` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `user` (
  `id` BINARY(16) NOT NULL,
  `name` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `bio` varchar(1000) DEFAULT NULL,
  `image` MEDIUMBLOB DEFAULT NULL,
  `timestamp_created` INT NOT NULL,
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `task_user_task_complete` (
  `id` BINARY(16) NOT NULL,
  `id__task` BINARY(16) NOT NULL,
  `id__user` BINARY(16) NOT NULL,
  `timestamp_created` INT NOT NULL,
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `task_user_task_star` (
  `id` BINARY(16) NOT NULL,
  `id__task` BINARY(16) NOT NULL,
  `id__user` BINARY(16) NOT NULL,
  `timestamp_created` INT NOT NULL,
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `task_user_task_pin` (
  `id` BINARY(16) NOT NULL,
  `id__task` BINARY(16) NOT NULL,
  `id__user` BINARY(16) NOT NULL,
  `timestamp_created` INT NOT NULL,
  PRIMARY KEY (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

/* https://www.javatpoint.com/mysql-uuid */
