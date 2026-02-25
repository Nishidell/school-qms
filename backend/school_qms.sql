-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2026 at 03:34 AM
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
-- Database: `school_qms`
--

-- --------------------------------------------------------

--
-- Table structure for table `carousel_images`
--

CREATE TABLE `carousel_images` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carousel_images`
--

INSERT INTO `carousel_images` (`id`, `image_path`, `uploaded_at`) VALUES
(4, '1771975464524.jpg', '2026-02-24 23:24:24'),
(5, '1771975468603.jpg', '2026-02-24 23:24:28'),
(6, '1771975472627.jpg', '2026-02-24 23:24:32');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `prefix` varchar(5) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `counter_name` varchar(50) DEFAULT 'Window 1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_name`, `prefix`, `is_active`, `counter_name`) VALUES
(5, 'Registrar', 'R', 1, 'Window 2'),
(6, 'Cashier', 'C', 1, 'Window 3'),
(7, 'Library', 'L', 1, 'Window 4'),
(8, 'Complaints', 'CO', 1, 'Window 5'),
(10, 'Documents', 'D', 1, 'Window 6');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `primary_color` varchar(20) DEFAULT '#B31B1B',
  `secondary_color` varchar(20) DEFAULT '#002366',
  `video_path` varchar(255) DEFAULT 'school-video.mp4',
  `logo_path` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `primary_color`, `secondary_color`, `video_path`, `logo_path`) VALUES
(1, '#7487e7', '#8f2424', '1771957433060.mp4', '1771958752639.png');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `studentName` varchar(50) DEFAULT NULL,
  `ticketNumber` varchar(50) NOT NULL,
  `serviceType` varchar(100) NOT NULL,
  `status` enum('waiting','serving','completed') DEFAULT 'waiting',
  `counter` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `studentName`, `ticketNumber`, `serviceType`, `status`, `counter`, `createdAt`) VALUES
(1, NULL, 'G-1', 'Documents', 'completed', 1, '2026-02-25 01:24:21'),
(2, NULL, 'G-2', 'Documents', 'completed', 1, '2026-02-25 01:25:32'),
(3, NULL, 'D-1', 'Documents', 'completed', 1, '2026-02-25 01:28:01'),
(4, NULL, 'D-2', 'Documents', 'completed', 1, '2026-02-25 01:28:43'),
(5, NULL, 'R-1', 'Registrar', 'serving', 1, '2026-02-25 01:36:22'),
(6, NULL, 'R-2', 'Registrar', 'serving', 1, '2026-02-25 01:36:34'),
(7, NULL, 'C-1', 'Cashier', 'serving', 1, '2026-02-25 01:36:41'),
(8, NULL, 'C-2', 'Cashier', 'waiting', NULL, '2026-02-25 01:36:47'),
(9, NULL, 'L-1', 'Library', 'serving', 1, '2026-02-25 01:36:57'),
(10, NULL, 'L-2', 'Library', 'waiting', NULL, '2026-02-25 01:37:02'),
(11, NULL, 'CO-1', 'Complaints', 'serving', 1, '2026-02-25 01:37:07'),
(12, NULL, 'CO-2', 'Complaints', 'waiting', NULL, '2026-02-25 01:37:16'),
(13, NULL, 'D-3', 'Documents', 'serving', 1, '2026-02-25 01:37:22'),
(14, NULL, 'D-4', 'Documents', 'waiting', NULL, '2026-02-25 01:37:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin','admin','employee') DEFAULT 'employee',
  `service_type` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `service_type`, `createdAt`) VALUES
(1, 'admin', '$2b$10$PZX73Oq6XtHYoBGxpf6CTOMrpNO4o..Vx6l6rsnprijpISqsiROsq', 'admin', 'all', '2026-02-24 15:28:57'),
(2, 'employee1', '$2b$10$kMTJQvnsvqMAYNeFjGHa4enyhnXNg/4armlOCGFbhKyLDEitbY8QW', 'employee', 'Registrar', '2026-02-24 16:41:36'),
(3, 'employee2', '$2b$10$xFbfb.AL4tmjdj5bqn2yWe/MylEP5KHdKbuW.sCjV4K2bqXnO29pG', 'employee', 'Registrar', '2026-02-24 17:17:58'),
(4, 'employee3', '$2b$10$95MdK/.LpKZc9PQ0hX4w0.new9t6XNuV3V6pe2BkYt.nV56jN/ozy', 'employee', 'Cashier', '2026-02-24 17:18:12'),
(5, 'employee4', '$2b$10$NxXaaIk/BeTSS3hJHsws7eOMqGJd0opNK8leuOGaFamOWbuVM1Aiy', 'employee', 'Library', '2026-02-24 17:20:14'),
(6, 'employee5', '$2b$10$AwKJcUPWXBne9k.OLdTSK.2WPC5lkTEJLCE3uW55eetpzQzwyignG', 'employee', 'Complaints', '2026-02-24 17:22:11'),
(7, 'superadmin', '$2b$10$PZX73Oq6XtHYoBGxpf6CTOMrpNO4o..Vx6l6rsnprijpISqsiROsq', 'superadmin', 'all', '2026-02-24 18:09:46'),
(8, 'employee6', '$2b$10$te9THafb1SnV/kex.Zqxt.iONpEeMKrgJPh.ip/SxZnvbZMHe.DoO', 'employee', 'Documents', '2026-02-25 01:13:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carousel_images`
--
ALTER TABLE `carousel_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_name` (`service_name`),
  ADD UNIQUE KEY `prefix` (`prefix`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticketNumber` (`ticketNumber`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carousel_images`
--
ALTER TABLE `carousel_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
