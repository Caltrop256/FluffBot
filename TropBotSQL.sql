-- --------------------------------------------------------
-- Host:                         nucleus.lostsig.net
-- Server version:               10.1.38-MariaDB-0+deb9u1 - Debian 9.8
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for tropbot
CREATE DATABASE IF NOT EXISTS `tropbot` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `tropbot`;

-- Dumping structure for table tropbot.cmdanal
CREATE TABLE IF NOT EXISTS `cmdanal` (
  `cmdname` varchar(50) DEFAULT NULL,
  `uses` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.coins
CREATE TABLE IF NOT EXISTS `coins` (
  `id` varchar(30) NOT NULL,
  `coins` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.commands
CREATE TABLE IF NOT EXISTS `commands` (
  `name` text NOT NULL,
  `moduleID` int(10) unsigned NOT NULL,
  `enabled` bit(1) NOT NULL,
  KEY `commandFK` (`moduleID`),
  CONSTRAINT `commandFK` FOREIGN KEY (`moduleID`) REFERENCES `modules` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.config
CREATE TABLE IF NOT EXISTS `config` (
  `key` varchar(100) NOT NULL,
  `value` varchar(100) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET sql_notes = 0;
-- Dumping data for table tropbot.config: ~19 rows (approximately)
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` (`key`, `value`) VALUES
	('curName', 'D$'),
	('autoAvatar', 'true'),
	('atSomeone', 'true'),
	('repeatMinimum', '3'),
	('repeatTime', '15'),
	('ruleAccept', '582141265244585994'),
	('color1', '638009917982244883'),
	('color2', '638010010361659427'),
	('other', '638010064988405770'),
	('pronouns', '785637449400320050'),
	('platinum', '1800'),
	('gold', '500'),
	('silver', '100'),
	('ownerID', '214298654863917059'),
	('spamFilter', 'false'),
	('lastshutdown', 'null'),
	('dadProb', '0'),
	('minStarboardScore', '5'),
	('starboardChannel', '562337386701520897'),
	('logChannel', '562328446445944872');
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
SET sql_notes = 1;

-- Dumping structure for table tropbot.events
CREATE TABLE IF NOT EXISTS `events` (
  `name` text NOT NULL,
  `moduleID` int(10) unsigned NOT NULL,
  `enabled` bit(1) NOT NULL,
  KEY `eventsFK` (`moduleID`),
  CONSTRAINT `eventsFK` FOREIGN KEY (`moduleID`) REFERENCES `modules` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.karma
CREATE TABLE IF NOT EXISTS `karma` (
  `id` varchar(35) NOT NULL DEFAULT '440064926661476352',
  `upvotes` int(11) NOT NULL DEFAULT '0',
  `downvotes` int(11) NOT NULL DEFAULT '0',
  `platinum` int(11) NOT NULL DEFAULT '0',
  `gold` int(11) NOT NULL DEFAULT '0',
  `silver` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.lastseen
CREATE TABLE IF NOT EXISTS `lastseen` (
  `id` varchar(35) NOT NULL,
  `activity` varchar(1000) DEFAULT NULL,
  `date` bigint(20) NOT NULL,
  `tag` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.leaveInfo
CREATE TABLE IF NOT EXISTS `leaveInfo` (
  `id` varchar(35) NOT NULL DEFAULT 'Error',
  `username` varchar(50) NOT NULL DEFAULT 'Error',
  `leftdate` bigint(20) NOT NULL,
  `roles` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.modules
CREATE TABLE IF NOT EXISTS `modules` (
  `ID` int(10) unsigned NOT NULL,
  `name` text NOT NULL,
  `enabled` bit(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.mute
CREATE TABLE IF NOT EXISTS `mute` (
  `id` varchar(35) NOT NULL,
  `invokinguser` varchar(35) DEFAULT NULL,
  `expiry` bigint(20) NOT NULL,
  `guild` varchar(35) DEFAULT NULL,
  `start` bigint(20) NOT NULL,
  `selfmute` tinyint(1) DEFAULT '0',
  `channel` varchar(35) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.prefixes
CREATE TABLE IF NOT EXISTS `prefixes` (
  `prefix` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.premReward
CREATE TABLE IF NOT EXISTS `premReward` (
  `id` varchar(35) DEFAULT NULL,
  `silver` int(11) NOT NULL,
  `gold` int(11) NOT NULL,
  `plat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.remindme
CREATE TABLE IF NOT EXISTS `remindme` (
  `channelid` varchar(35) NOT NULL,
  `userid` varchar(35) NOT NULL,
  `reminder` varchar(1000) NOT NULL,
  `expiry` bigint(20) NOT NULL,
  `start` bigint(20) NOT NULL,
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.subscriptions
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `avatar` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping structure for table tropbot.usercoinchange
CREATE TABLE IF NOT EXISTS `usercoinchange` (
  `DateChanged` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userID` bigint(20) NOT NULL,
  `Coins` bigint(20) unsigned NOT NULL,
  `his` tinyint(3) unsigned NOT NULL DEFAULT '220'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping structure for table tropbot.warn
CREATE TABLE IF NOT EXISTS `warn` (
  `warnid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(35) NOT NULL DEFAULT '440064926661476352',
  `reason` varchar(1000) NOT NULL DEFAULT 'REASON FAILSAFE',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `invokinguser` varchar(35) NOT NULL DEFAULT '559411424590299149',
  `expiry` bigint(20) DEFAULT NULL,
  `applied` bigint(20) NOT NULL,
  `guild` varchar(35) DEFAULT '562324876330008576',
  `warnlevel` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`warnid`)
) ENGINE=InnoDB AUTO_INCREMENT=10040 DEFAULT CHARSET=utf8mb4;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;