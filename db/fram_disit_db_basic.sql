-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generato il: Ago 26, 2016 alle 16:48
-- Versione del server: 5.5.16
-- Versione PHP: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `fram_disit_db`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `aspect`
--

CREATE TABLE IF NOT EXISTS `aspect` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` text,
  `idModel` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idModel` (`idModel`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=784 ;

--
-- Struttura della tabella `criteria`
--

CREATE TABLE IF NOT EXISTS `criteria` (
  `id` int(11) NOT NULL,
  `position` text NOT NULL,
  `description` text NOT NULL,
  `idModel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Struttura della tabella `framgroup`
--

CREATE TABLE IF NOT EXISTS `framgroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `description` text NOT NULL,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `color` varchar(20) NOT NULL DEFAULT '#fff',
  `idModel` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ModelIndex` (`idModel`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;


--
-- Struttura della tabella `framgroup_function`
--

CREATE TABLE IF NOT EXISTS `framgroup_function` (
  `idGroup` int(11) NOT NULL,
  `idFunction` int(11) NOT NULL,
  PRIMARY KEY (`idGroup`,`idFunction`),
  KEY `idFunction` (`idFunction`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Struttura della tabella `framgroup_hierarchy`
--

CREATE TABLE IF NOT EXISTS `framgroup_hierarchy` (
  `idGroup_father` int(11) NOT NULL,
  `idGroup_child` int(11) NOT NULL,
  PRIMARY KEY (`idGroup_father`,`idGroup_child`),
  KEY `idGroup_child` (`idGroup_child`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Struttura della tabella `function`
--

CREATE TABLE IF NOT EXISTS `function` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `description` text NOT NULL,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `color` varchar(20) NOT NULL DEFAULT '#fff',
  `type` int(11) NOT NULL,
  `idModel` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ModelIndex` (`idModel`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=310 ;


--
-- Struttura della tabella `function_aspect`
--

CREATE TABLE IF NOT EXISTS `function_aspect` (
  `idFunction` int(11) NOT NULL,
  `idAspect` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  PRIMARY KEY (`idFunction`,`idAspect`,`type`),
  KEY `idFunction` (`idFunction`),
  KEY `idAspect` (`idAspect`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Struttura della tabella `model`
--

CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `objective` text NOT NULL,
  `description` text,
  `type` varchar(20) DEFAULT NULL,
  `size` int(11) NOT NULL,
  `date_create` timestamp NULL DEFAULT NULL,
  `date_last_modify` timestamp NULL DEFAULT NULL,
  `idUser` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserIndex` (`idUser`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=40 ;

--
-- Struttura della tabella `model_function`
--

CREATE TABLE IF NOT EXISTS `model_function` (
  `idInstance` int(11) NOT NULL,
  `idFunction` int(11) NOT NULL,
  `time_precision` int(11) DEFAULT NULL,
  `potential_precision` int(11) DEFAULT NULL,
  `function_manager` int(11) DEFAULT NULL,
  PRIMARY KEY (`idInstance`,`idFunction`),
  KEY `idFunction` (`idFunction`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Struttura della tabella `model_instance`
--

CREATE TABLE IF NOT EXISTS `model_instance` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL,
  `idUser` int(11) NOT NULL,
  `idModel` int(11) NOT NULL,
  `date_create` timestamp NULL DEFAULT NULL,
  `date_last_modify` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserIndex` (`idUser`),
  KEY `ModelIndex` (`idModel`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `model_instance`
--

INSERT INTO `model_instance` (`id`, `description`, `idUser`, `idModel`, `date_create`, `date_last_modify`) VALUES
(10, '', 3, 12, '2016-03-04 09:51:00', '2016-03-04 09:51:00'),
(11, 'SDsds', 5, 13, '2016-04-04 13:22:29', '2016-04-04 13:22:29'),
(12, 'Test', 5, 13, '2016-03-22 11:50:22', '2016-03-22 11:50:22'),
(13, 'Lend delay', 5, 14, '2016-04-04 13:23:55', '2016-04-04 13:23:55'),
(14, 'Instance for patient', 5, 19, '2016-05-02 14:07:53', '2016-05-02 14:07:53'),
(15, 'Istance Test', 5, 14, '2016-03-23 20:41:26', '2016-03-23 20:41:26'),
(17, 'New Instance', 5, 24, '2016-05-02 12:55:38', '2016-05-02 12:55:38'),
(18, 'water malfunctioning', 5, 25, '2016-05-03 14:31:46', '2016-05-03 14:31:46'),
(19, 'Caso 115 su un altro intervento', 5, 21, '2016-05-19 19:57:05', '2016-05-19 19:57:05'),
(20, 'New Instance', 5, 31, '2016-06-06 20:17:26', '2016-06-06 20:17:26'),
(21, 'Anomalies detected', 5, 34, '2016-06-18 15:41:14', '2016-06-18 15:41:14'),
(22, 'rerr', 5, 39, '2016-08-12 12:55:38', '2016-08-12 12:55:38');

-- --------------------------------------------------------

--
-- Struttura della tabella `permit`
--

CREATE TABLE IF NOT EXISTS `permit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dump dei dati per la tabella `permit`
--

INSERT INTO `permit` (`id`, `description`, `type`) VALUES
(1, 'Visualizzazione di tutti i modelli', 0),
(2, 'Creazione di un nuovo modello', 0),
(3, 'Modifica modello', 0),
(4, 'Salvataggio modello', 0),
(5, 'Clonazione modello', 0),
(6, 'Eliminazione modello', 0),
(7, 'Visualizzazione istanze modello', 1),
(8, 'Creazione nuova istanza', 1),
(9, 'Modifica istanza modello', 1),
(10, 'Salvataggio istanza modello', 1),
(11, 'Eliminazione istanza', 1),
(12, 'Calcolo decisione', 1),
(13, 'Impostazioni applicazione', 2),
(14, 'Gestione permessi gruppi di utenti', 2),
(15, 'Clonazione istanza modello', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `country` text NOT NULL,
  `password` text NOT NULL,
  `userType` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `UserGroupIndex` (`userType`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dump dei dati per la tabella `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `country`, `password`, `userType`) VALUES
(1, 'admin', 'admin@disit.org', 'Italia', '*d1s1t*', 4),
(2, 'marco', 'marco.bartolozzi@unifi.it', 'Italia', 'marco1234', 3),
(3, 'Paolo', 'paolo.nesi@unifi.it', 'Italia', 'paolo', 3),
(4, 'Luca', 'luca.santi@unifi.it', 'Italia', 'luca1234', 3),
(5, 'disit', 'alexraz@hotmail.it', 'Italia', '*d1s1t*', 4);

-- --------------------------------------------------------

--
-- Struttura della tabella `usergroup_permits`
--

CREATE TABLE IF NOT EXISTS `usergroup_permits` (
  `idUserGroup` int(11) NOT NULL,
  `idPermit` int(11) NOT NULL,
  KEY `UserGroupIndex` (`idUserGroup`),
  KEY `PermitIndex` (`idPermit`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `usergroup_permits`
--

INSERT INTO `usergroup_permits` (`idUserGroup`, `idPermit`) VALUES
(1, 1),
(1, 7),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7),
(4, 8),
(4, 9),
(4, 10),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(2, 1),
(2, 7),
(2, 9),
(2, 12),
(2, 15),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(3, 15);

-- --------------------------------------------------------

--
-- Struttura della tabella `user_group`
--

CREATE TABLE IF NOT EXISTS `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dump dei dati per la tabella `user_group`
--

INSERT INTO `user_group` (`id`, `description`) VALUES
(1, 'User Basic'),
(2, 'User Advanced'),
(3, 'Decision Maker'),
(4, 'Administrator');

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `aspect`
--
ALTER TABLE `aspect`
  ADD CONSTRAINT `aspect_ibfk_1` FOREIGN KEY (`idModel`) REFERENCES `model` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `framgroup`
--
ALTER TABLE `framgroup`
  ADD CONSTRAINT `framgroup_ibfk_1` FOREIGN KEY (`idModel`) REFERENCES `model` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `framgroup_function`
--
ALTER TABLE `framgroup_function`
  ADD CONSTRAINT `framgroup_function_ibfk_1` FOREIGN KEY (`idGroup`) REFERENCES `framgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `framgroup_function_ibfk_2` FOREIGN KEY (`idFunction`) REFERENCES `function` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `framgroup_hierarchy`
--
ALTER TABLE `framgroup_hierarchy`
  ADD CONSTRAINT `framgroup_hierarchy_ibfk_1` FOREIGN KEY (`idGroup_father`) REFERENCES `framgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `framgroup_hierarchy_ibfk_2` FOREIGN KEY (`idGroup_child`) REFERENCES `framgroup` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `function`
--
ALTER TABLE `function`
  ADD CONSTRAINT `function_ibfk_1` FOREIGN KEY (`idModel`) REFERENCES `model` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `function_aspect`
--
ALTER TABLE `function_aspect`
  ADD CONSTRAINT `function_aspect_ibfk_1` FOREIGN KEY (`idFunction`) REFERENCES `function` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `function_aspect_ibfk_2` FOREIGN KEY (`idAspect`) REFERENCES `aspect` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `model`
--
ALTER TABLE `model`
  ADD CONSTRAINT `model_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);

--
-- Limiti per la tabella `model_function`
--
ALTER TABLE `model_function`
  ADD CONSTRAINT `model_function_ibfk_1` FOREIGN KEY (`idInstance`) REFERENCES `model_instance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `model_function_ibfk_2` FOREIGN KEY (`idFunction`) REFERENCES `function` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `model_instance`
--
ALTER TABLE `model_instance`
  ADD CONSTRAINT `model_instance_ibfk_3` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `model_instance_ibfk_4` FOREIGN KEY (`idModel`) REFERENCES `model` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`userType`) REFERENCES `user_group` (`id`);

--
-- Limiti per la tabella `usergroup_permits`
--
ALTER TABLE `usergroup_permits`
  ADD CONSTRAINT `usergroup_permits_ibfk_1` FOREIGN KEY (`idUserGroup`) REFERENCES `user_group` (`id`),
  ADD CONSTRAINT `usergroup_permits_ibfk_2` FOREIGN KEY (`idPermit`) REFERENCES `permit` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
