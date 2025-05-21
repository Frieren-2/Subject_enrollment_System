-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 09:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `subject_enlisting`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `username` varchar(40) DEFAULT NULL,
  `password` varchar(40) DEFAULT NULL,
  `usertype` varchar(40) DEFAULT NULL,
  `time_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `name`, `username`, `password`, `usertype`, `time_created`) VALUES
(1, 'admin', 'admin', 'admin123', 'admin', '2025-04-24 11:55:53'),
(2, 'Algem', 'algem', 'algem123', 'instructor', '2025-04-24 11:55:53');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `instructor_id` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`instructor_id`, `name`) VALUES
(1, 'Daryll A. Cabagay'),
(2, 'Ian Pacquio'),
(3, 'Gerardo Carlos'),
(4, 'Adam Ken Mapalo'),
(5, 'Zoren Bajao'),
(6, 'Junell Bojocan'),
(7, 'Mary Darlyn Arcayna'),
(8, 'Nino Habagat'),
(9, 'Von Janus Amil'),
(10, 'Marjorie Centino'),
(11, 'Jamel Pandiin');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `year` varchar(40) NOT NULL,
  `USN` bigint(255) NOT NULL,
  `course` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `name`, `year`, `USN`, `course`) VALUES
(1, 'Juan Dela Cruz', '1st year', 23000100001, 'BS in Computer Science'),
(2, 'Maria Santos', '1st year', 23000100002, 'BS in Computer Science'),
(3, 'Pedro Reyes', '1st year', 23000100003, 'BS in Computer Science'),
(4, 'Ana Gonzales', '1st year', 23000100004, 'BS in Computer Science'),
(5, 'Luis Garcia', '1st year', 23000100005, 'BS in Computer Science'),
(6, 'Sofia Mendoza', '1st year', 23000100006, 'BS in Computer Science'),
(7, 'Miguel Torres', '1st year', 23000100007, 'BS in Computer Science'),
(8, 'Isabella Lim', '1st year', 23000100008, 'BS in Computer Science'),
(9, 'Gabriel Tan', '1st year', 23000100009, 'BS in Computer Science'),
(10, 'Sophia Reyes', '1st year', 23000100010, 'BS in Computer Science'),
(11, 'Rafael Bautista', '1st year', 23000100011, 'BS in Computer Science'),
(12, 'Emma Rodriguez', '1st year', 23000100012, 'BS in Computer Science'),
(13, 'Daniel Fernandez', '1st year', 23000100013, 'BS in Computer Science'),
(14, 'Olivia Ramos', '1st year', 23000100014, 'BS in Computer Science'),
(15, 'Mateo Cruz', '1st year', 23000100015, 'BS in Computer Science'),
(16, 'Amelia Pascual', '1st year', 23000100016, 'BS in Computer Science'),
(17, 'Santiago Diaz', '1st year', 23000100017, 'BS in Computer Science'),
(18, 'Victoria Castro', '1st year', 23000100018, 'BS in Computer Science'),
(19, 'Samuel Villanueva', '1st year', 23000100019, 'BS in Computer Science'),
(20, 'Camila Domingo', '1st year', 23000100020, 'BS in Computer Science'),
(21, 'Alexander Navarro', '1st year', 23000100021, 'BS in Computer Science'),
(22, 'Mia Aquino', '1st year', 23000100022, 'BS in Computer Science'),
(23, 'Benjamin Flores', '1st year', 23000100023, 'BS in Computer Science'),
(24, 'Charlotte Rivera', '1st year', 23000100024, 'BS in Computer Science'),
(25, 'Lucas Morales', '1st year', 23000100025, 'BS in Computer Science'),
(26, 'Ethan Dela Cruz', '2nd year', 22000100001, 'BS in Computer Science'),
(27, 'Ava Santos', '2nd year', 22000100002, 'BS in Computer Science'),
(28, 'Noah Reyes', '2nd year', 22000100003, 'BS in Computer Science'),
(29, 'Isabella Gonzales', '2nd year', 22000100004, 'BS in Computer Science'),
(30, 'Liam Garcia', '2nd year', 22000100005, 'BS in Computer Science'),
(31, 'Emma Mendoza', '2nd year', 22000100006, 'BS in Computer Science'),
(32, 'Oliver Torres', '2nd year', 22000100007, 'BS in Computer Science'),
(33, 'Sophia Lim', '2nd year', 22000100008, 'BS in Computer Science'),
(34, 'William Tan', '2nd year', 22000100009, 'BS in Computer Science'),
(35, 'Mia Reyes', '2nd year', 22000100010, 'BS in Computer Science'),
(36, 'James Bautista', '2nd year', 22000100011, 'BS in Computer Science'),
(37, 'Charlotte Rodriguez', '2nd year', 22000100012, 'BS in Computer Science'),
(38, 'Benjamin Fernandez', '2nd year', 22000100013, 'BS in Computer Science'),
(39, 'Amelia Ramos', '2nd year', 22000100014, 'BS in Computer Science'),
(40, 'Lucas Cruz', '2nd year', 22000100015, 'BS in Computer Science'),
(41, 'Harper Pascual', '2nd year', 22000100016, 'BS in Computer Science'),
(42, 'Henry Diaz', '2nd year', 22000100017, 'BS in Computer Science'),
(43, 'Evelyn Castro', '2nd year', 22000100018, 'BS in Computer Science'),
(44, 'Alexander Villanueva', '2nd year', 22000100019, 'BS in Computer Science'),
(45, 'Abigail Domingo', '2nd year', 22000100020, 'BS in Computer Science'),
(46, 'Sebastian Navarro', '2nd year', 22000100021, 'BS in Computer Science'),
(47, 'Emily Aquino', '2nd year', 22000100022, 'BS in Computer Science'),
(48, 'Julian Flores', '2nd year', 22000100023, 'BS in Computer Science'),
(49, 'Aria Rivera', '2nd year', 22000100024, 'BS in Computer Science'),
(50, 'Matthew Morales', '2nd year', 22000100025, 'BS in Computer Science'),
(51, 'Daniel Dela Cruz', '3rd year', 21000100001, 'BS in Computer Science'),
(52, 'Lily Santos', '3rd year', 21000100002, 'BS in Computer Science'),
(53, 'Joshua Reyes', '3rd year', 21000100003, 'BS in Computer Science'),
(54, 'Zoey Gonzales', '3rd year', 21000100004, 'BS in Computer Science'),
(55, 'Gabriel Garcia', '3rd year', 21000100005, 'BS in Computer Science'),
(56, 'Chloe Mendoza', '3rd year', 21000100006, 'BS in Computer Science'),
(57, 'Andrew Torres', '3rd year', 21000100007, 'BS in Computer Science'),
(58, 'Sofia Lim', '3rd year', 21000100008, 'BS in Computer Science'),
(59, 'Joseph Tan', '3rd year', 21000100009, 'BS in Computer Science'),
(60, 'Madison Reyes', '3rd year', 21000100010, 'BS in Computer Science'),
(61, 'David Bautista', '3rd year', 21000100011, 'BS in Computer Science'),
(62, 'Avery Rodriguez', '3rd year', 21000100012, 'BS in Computer Science'),
(63, 'Christopher Fernandez', '3rd year', 21000100013, 'BS in Computer Science'),
(64, 'Scarlett Ramos', '3rd year', 21000100014, 'BS in Computer Science'),
(65, 'Logan Cruz', '3rd year', 21000100015, 'BS in Computer Science'),
(66, 'Grace Pascual', '3rd year', 21000100016, 'BS in Computer Science'),
(67, 'John Diaz', '3rd year', 21000100017, 'BS in Computer Science'),
(68, 'Elizabeth Castro', '3rd year', 21000100018, 'BS in Computer Science'),
(69, 'Ryan Villanueva', '3rd year', 21000100019, 'BS in Computer Science'),
(70, 'Victoria Domingo', '3rd year', 21000100020, 'BS in Computer Science'),
(71, 'Nathan Navarro', '3rd year', 21000100021, 'BS in Computer Science'),
(72, 'Hannah Aquino', '3rd year', 21000100022, 'BS in Computer Science'),
(73, 'Aaron Flores', '3rd year', 21000100023, 'BS in Computer Science'),
(74, 'Audrey Rivera', '3rd year', 21000100024, 'BS in Computer Science'),
(75, 'Jason Morales', '3rd year', 21000100025, 'BS in Computer Science'),
(76, 'Michael Dela Cruz', '4th year', 20000100001, 'BS in Computer Science'),
(77, 'Samantha Santos', '4th year', 20000100002, 'BS in Computer Science'),
(78, 'Jacob Reyes', '4th year', 20000100003, 'BS in Computer Science'),
(79, 'Natalie Gonzales', '4th year', 20000100004, 'BS in Computer Science'),
(80, 'Christian Garcia', '4th year', 20000100005, 'BS in Computer Science'),
(81, 'Leah Mendoza', '4th year', 20000100006, 'BS in Computer Science'),
(82, 'Kevin Torres', '4th year', 20000100007, 'BS in Computer Science'),
(83, 'Rachel Lim', '4th year', 20000100008, 'BS in Computer Science'),
(84, 'Thomas Tan', '4th year', 20000100009, 'BS in Computer Science'),
(85, 'Lauren Reyes', '4th year', 20000100010, 'BS in Computer Science'),
(86, 'Jonathan Bautista', '4th year', 20000100011, 'BS in Computer Science'),
(87, 'Jessica Rodriguez', '4th year', 20000100012, 'BS in Computer Science'),
(88, 'Nicholas Fernandez', '4th year', 20000100013, 'BS in Computer Science'),
(89, 'Sarah Ramos', '4th year', 20000100014, 'BS in Computer Science'),
(90, 'Anthony Cruz', '4th year', 20000100015, 'BS in Computer Science'),
(91, 'Rebecca Pascual', '4th year', 20000100016, 'BS in Computer Science'),
(92, 'Steven Diaz', '4th year', 20000100017, 'BS in Computer Science'),
(93, 'Katherine Castro', '4th year', 20000100018, 'BS in Computer Science'),
(94, 'Andrew Villanueva', '4th year', 20000100019, 'BS in Computer Science'),
(95, 'Jennifer Domingo', '4th year', 20000100020, 'BS in Computer Science'),
(96, 'Christopher Navarro', '4th year', 20000100021, 'BS in Computer Science'),
(97, 'Amanda Aquino', '4th year', 20000100022, 'BS in Computer Science'),
(98, 'Brandon Flores', '4th year', 20000100023, 'BS in Computer Science'),
(99, 'Melissa Rivera', '4th year', 20000100024, 'BS in Computer Science'),
(100, 'Joshua Morales', '4th year', 20000100025, 'BS in Computer Science'),
(101, 'Carlos Dela Cruz', '1st year', 23000200001, 'BS in Information Technology'),
(102, 'Andrea Santos', '1st year', 23000200002, 'BS in Information Technology'),
(103, 'Marco Reyes', '1st year', 23000200003, 'BS in Information Technology'),
(104, 'Patricia Gonzales', '1st year', 23000200004, 'BS in Information Technology'),
(105, 'Angelo Garcia', '1st year', 23000200005, 'BS in Information Technology'),
(106, 'Nicole Mendoza', '1st year', 23000200006, 'BS in Information Technology'),
(107, 'Diego Torres', '1st year', 23000200007, 'BS in Information Technology'),
(108, 'Bianca Lim', '1st year', 23000200008, 'BS in Information Technology'),
(109, 'Paolo Tan', '1st year', 23000200009, 'BS in Information Technology'),
(110, 'Gabriela Reyes', '1st year', 23000200010, 'BS in Information Technology'),
(111, 'Anton Bautista', '1st year', 23000200011, 'BS in Information Technology'),
(112, 'Danielle Rodriguez', '1st year', 23000200012, 'BS in Information Technology'),
(113, 'Vincent Fernandez', '1st year', 23000200013, 'BS in Information Technology'),
(114, 'Christine Ramos', '1st year', 23000200014, 'BS in Information Technology'),
(115, 'Adrian Cruz', '1st year', 23000200015, 'BS in Information Technology'),
(116, 'Hannah Pascual', '1st year', 23000200016, 'BS in Information Technology'),
(117, 'Jerome Diaz', '1st year', 23000200017, 'BS in Information Technology'),
(118, 'Katrina Castro', '1st year', 23000200018, 'BS in Information Technology'),
(119, 'Raphael Villanueva', '1st year', 23000200019, 'BS in Information Technology'),
(120, 'Angelica Domingo', '1st year', 23000200020, 'BS in Information Technology'),
(121, 'Francis Navarro', '1st year', 23000200021, 'BS in Information Technology'),
(122, 'Joyce Aquino', '1st year', 23000200022, 'BS in Information Technology'),
(123, 'Gerald Flores', '1st year', 23000200023, 'BS in Information Technology'),
(124, 'April Rivera', '1st year', 23000200024, 'BS in Information Technology'),
(125, 'Christian Morales', '1st year', 23000200025, 'BS in Information Technology'),
(126, 'Philip Dela Cruz', '2nd year', 22000200001, 'BS in Information Technology'),
(127, 'Michelle Santos', '2nd year', 22000200002, 'BS in Information Technology'),
(128, 'Justin Reyes', '2nd year', 22000200003, 'BS in Information Technology'),
(129, 'Stephanie Gonzales', '2nd year', 22000200004, 'BS in Information Technology'),
(130, 'Bernard Garcia', '2nd year', 22000200005, 'BS in Information Technology'),
(131, 'Kristine Mendoza', '2nd year', 22000200006, 'BS in Information Technology'),
(132, 'Raymond Torres', '2nd year', 22000200007, 'BS in Information Technology'),
(133, 'Jasmine Lim', '2nd year', 22000200008, 'BS in Information Technology'),
(134, 'Kenneth Tan', '2nd year', 22000200009, 'BS in Information Technology'),
(135, 'Mariel Reyes', '2nd year', 22000200010, 'BS in Information Technology'),
(136, 'Ronaldo Bautista', '2nd year', 22000200011, 'BS in Information Technology'),
(137, 'Erica Rodriguez', '2nd year', 22000200012, 'BS in Information Technology'),
(138, 'Neil Fernandez', '2nd year', 22000200013, 'BS in Information Technology'),
(139, 'Denise Ramos', '2nd year', 22000200014, 'BS in Information Technology'),
(140, 'Ivan Cruz', '2nd year', 22000200015, 'BS in Information Technology'),
(141, 'Judy Pascual', '2nd year', 22000200016, 'BS in Information Technology'),
(142, 'Bryan Diaz', '2nd year', 22000200017, 'BS in Information Technology'),
(143, 'Vanessa Castro', '2nd year', 22000200018, 'BS in Information Technology'),
(144, 'Mark Villanueva', '2nd year', 22000200019, 'BS in Information Technology'),
(145, 'Jillian Domingo', '2nd year', 22000200020, 'BS in Information Technology'),
(146, 'Harold Navarro', '2nd year', 22000200021, 'BS in Information Technology'),
(147, 'Trisha Aquino', '2nd year', 22000200022, 'BS in Information Technology'),
(148, 'Kyle Flores', '2nd year', 22000200023, 'BS in Information Technology'),
(149, 'Jenny Rivera', '2nd year', 22000200024, 'BS in Information Technology'),
(150, 'Alvin Morales', '2nd year', 22000200025, 'BS in Information Technology'),
(151, 'Joel Dela Cruz', '3rd year', 21000200001, 'BS in Information Technology'),
(152, 'Carina Santos', '3rd year', 21000200002, 'BS in Information Technology'),
(153, 'Rico Reyes', '3rd year', 21000200003, 'BS in Information Technology'),
(154, 'Tina Gonzales', '3rd year', 21000200004, 'BS in Information Technology'),
(155, 'Lance Garcia', '3rd year', 21000200005, 'BS in Information Technology'),
(156, 'Donna Mendoza', '3rd year', 21000200006, 'BS in Information Technology'),
(157, 'Eric Torres', '3rd year', 21000200007, 'BS in Information Technology'),
(158, 'Angelique Lim', '3rd year', 21000200008, 'BS in Information Technology'),
(159, 'Winston Tan', '3rd year', 21000200009, 'BS in Information Technology'),
(160, 'Cherry Reyes', '3rd year', 21000200010, 'BS in Information Technology'),
(161, 'Julius Bautista', '3rd year', 21000200011, 'BS in Information Technology'),
(162, 'Marjorie Rodriguez', '3rd year', 21000200012, 'BS in Information Technology'),
(163, 'Dexter Fernandez', '3rd year', 21000200013, 'BS in Information Technology'),
(164, 'Kris Ramos', '3rd year', 21000200014, 'BS in Information Technology'),
(165, 'Allan Cruz', '3rd year', 21000200015, 'BS in Information Technology'),
(166, 'Hazel Pascual', '3rd year', 21000200016, 'BS in Information Technology'),
(167, 'Dennis Diaz', '3rd year', 21000200017, 'BS in Information Technology'),
(168, 'Bernadette Castro', '3rd year', 21000200018, 'BS in Information Technology'),
(169, 'Cedric Villanueva', '3rd year', 21000200019, 'BS in Information Technology'),
(170, 'Chelsea Domingo', '3rd year', 21000200020, 'BS in Information Technology'),
(171, 'Glenn Navarro', '3rd year', 21000200021, 'BS in Information Technology'),
(172, 'Maylene Aquino', '3rd year', 21000200022, 'BS in Information Technology'),
(173, 'Russel Flores', '3rd year', 21000200023, 'BS in Information Technology'),
(174, 'Kathleen Rivera', '3rd year', 21000200024, 'BS in Information Technology'),
(175, 'Aldrin Morales', '3rd year', 21000200025, 'BS in Information Technology'),
(176, 'Renz Dela Cruz', '4th year', 20000200001, 'BS in Information Technology'),
(177, 'Raquel Santos', '4th year', 20000200002, 'BS in Information Technology'),
(178, 'Darwin Reyes', '4th year', 20000200003, 'BS in Information Technology'),
(179, 'Rowena Gonzales', '4th year', 20000200004, 'BS in Information Technology'),
(180, 'Gilbert Garcia', '4th year', 20000200005, 'BS in Information Technology'),
(181, 'Jane Mendoza', '4th year', 20000200006, 'BS in Information Technology'),
(182, 'Harvey Torres', '4th year', 20000200007, 'BS in Information Technology'),
(183, 'Diane Lim', '4th year', 20000200008, 'BS in Information Technology'),
(184, 'Eugene Tan', '4th year', 20000200009, 'BS in Information Technology'),
(185, 'Liza Reyes', '4th year', 20000200010, 'BS in Information Technology'),
(186, 'Marvin Bautista', '4th year', 20000200011, 'BS in Information Technology'),
(187, 'Alyssa Rodriguez', '4th year', 20000200012, 'BS in Information Technology'),
(188, 'Chester Fernandez', '4th year', 20000200013, 'BS in Information Technology'),
(189, 'Abby Ramos', '4th year', 20000200014, 'BS in Information Technology'),
(190, 'Edward Cruz', '4th year', 20000200015, 'BS in Information Technology'),
(191, 'Sheila Pascual', '4th year', 20000200016, 'BS in Information Technology'),
(192, 'Rodney Diaz', '4th year', 20000200017, 'BS in Information Technology'),
(193, 'Mylene Castro', '4th year', 20000200018, 'BS in Information Technology'),
(194, 'Nelson Villanueva', '4th year', 20000200019, 'BS in Information Technology'),
(195, 'Maricar Domingo', '4th year', 20000200020, 'BS in Information Technology'),
(196, 'Jeffrey Navarro', '4th year', 20000200021, 'BS in Information Technology'),
(197, 'Claire Aquino', '4th year', 20000200022, 'BS in Information Technology'),
(198, 'Wilson Flores', '4th year', 20000200023, 'BS in Information Technology'),
(199, 'Darlene Rivera', '4th year', 20000200024, 'BS in Information Technology'),
(200, 'Arnel Morales', '4th year', 20000200025, 'BS in Information Technology');

-- --------------------------------------------------------

--
-- Table structure for table `student_subject`
--

CREATE TABLE `student_subject` (
  `ss_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subj_avail_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_subject`
--

INSERT INTO `student_subject` (`ss_id`, `student_id`, `subj_avail_id`) VALUES
(45, 1, 6),
(47, 1, 7),
(46, 1, 11);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` int(11) NOT NULL,
  `subject` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `subject`) VALUES
(116, 'Introduction to Computing'),
(117, 'Mathematics for Computing'),
(118, 'Communication Skills'),
(119, 'Physical Science'),
(120, 'Philippine History'),
(121, 'PE I'),
(122, 'NSTP I'),
(123, 'Object-Oriented Programming'),
(124, 'Linear Algebra'),
(125, 'English II'),
(126, 'Introduction to Human-Computer Interacti'),
(127, 'PE II'),
(128, 'NSTP II'),
(129, 'Data Structures and Algorithms'),
(130, 'Computer Organization and Architecture'),
(131, 'Operating Systems'),
(132, 'Statistics and Probability'),
(133, 'PE III'),
(134, 'Ethics'),
(135, 'Software Engineering'),
(136, 'Automata and Formal Languages'),
(137, 'Database Management Systems'),
(138, 'Web Development'),
(139, 'PE IV'),
(140, 'Environmental Science'),
(141, 'Computer Networks'),
(142, 'Mobile Application Development'),
(143, 'Information Assurance and Security'),
(144, 'Research Methods'),
(145, 'CS Elective 1'),
(146, 'CS Elective 2'),
(147, 'CS Elective 3 (Game Development)'),
(148, 'CS Elective 4 (Game Development)'),
(149, 'Professional Issues in IT'),
(150, 'Artificial Intelligence'),
(151, 'Machine Learning'),
(152, 'Compiler Design'),
(153, 'Systems Analysis and Design'),
(154, 'Capstone Project I'),
(155, 'Capstone Project II'),
(156, 'Cloud Computing'),
(157, 'Advanced Web Applications'),
(158, 'Internship'),
(159, 'On-the-Job Training (OJT)'),
(160, 'Seminar and Field Trips'),
(161, 'Technopreneurship'),
(162, 'Final Defense'),
(163, 'Fundamentals of Information Technology'),
(164, 'Programming 1'),
(165, 'Mathematics in the Modern World'),
(166, 'Purposive Communication'),
(167, 'Understanding the Self'),
(168, 'Programming 2 (Object-Oriented)'),
(169, 'Computer Hardware and Servicing'),
(170, 'The Contemporary World'),
(171, 'Reading Visual Arts'),
(172, 'Science, Technology, and Society'),
(173, 'Information Management'),
(174, 'Platform Technologies'),
(175, 'System Integration and Architecture 1'),
(176, 'Web Systems and Technologies'),
(177, 'Networking 1 (Cisco or equivalent)'),
(178, 'IT Elective 1'),
(179, 'IT Elective 2'),
(180, 'IT Elective 3 (Web Development)'),
(181, 'IT Elective 4 (Web Development)'),
(182, 'Human Computer Interaction'),
(183, 'Multimedia Systems'),
(184, 'Quantitative Methods'),
(185, 'Integrative Programming and Technologies'),
(186, 'Enterprise Architecture'),
(187, 'Social and Professional Issues'),
(188, 'Emerging Technologies'),
(189, 'Thesis Project 1'),
(190, 'Thesis Project 2'),
(191, 'Calculus 1'),
(192, 'Calculus 2'),
(193, 'Calculus Base-Physics 1'),
(194, 'Calculus Base-Physics 2');

-- --------------------------------------------------------

--
-- Table structure for table `subj_avail`
--

CREATE TABLE `subj_avail` (
  `sub_avail_id` int(11) NOT NULL,
  `Sub_code` varchar(40) DEFAULT NULL,
  `course` varchar(40) NOT NULL,
  `year` varchar(40) DEFAULT NULL,
  `semester` varchar(40) DEFAULT NULL,
  `units` int(10) NOT NULL,
  `room` varchar(40) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_of_week` varchar(40) DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `subject_id` int(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subj_avail`
--

INSERT INTO `subj_avail` (`sub_avail_id`, `Sub_code`, `course`, `year`, `semester`, `units`, `room`, `start_time`, `end_time`, `day_of_week`, `instructor_id`, `subject_id`) VALUES
(6, 'CSITC100', 'BS Information Technology', '2nd Year', '2nd Semester', 3, 'CL2', '09:30:00', '11:00:00', 'Monday, Wednesday, Thursday', 2, 126),
(7, 'RVA213', 'BS Computer Science', '3rd Year', '2nd Semester', 3, '201', '07:30:00', '09:00:00', 'Monday, Thursday, Saturday', 9, 171),
(8, 'CSITIOT20', 'BS Computer Science', '3rd Year', '2nd Semester', 3, 'CL3', '14:30:00', '16:00:00', 'Monday, Thursday', 1, 156),
(10, 'CSDSA120', 'BS Computer Science', '2nd Year', '2nd Semester', 2, 'CL3', '15:30:00', '17:00:00', 'Monday, Wednesday, Thursday', 5, 129),
(11, 'ITMUS023', 'BS Computer Science', '2nd Year', '2nd Semester', 3, 'CL3', '15:30:00', '17:00:00', 'Monday, Wednesday, Thursday', 5, 183);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`instructor_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `student_subject`
--
ALTER TABLE `student_subject`
  ADD PRIMARY KEY (`ss_id`),
  ADD UNIQUE KEY `unique_enrollment` (`student_id`,`subj_avail_id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `subj_avail`
--
ALTER TABLE `subj_avail`
  ADD PRIMARY KEY (`sub_avail_id`),
  ADD KEY `instructor_subj_avail` (`instructor_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `instructor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `student_subject`
--
ALTER TABLE `student_subject`
  MODIFY `ss_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `subj_avail`
--
ALTER TABLE `subj_avail`
  MODIFY `sub_avail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
