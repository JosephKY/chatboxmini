-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2023 at 06:43 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatboxmini`
--

-- --------------------------------------------------------

--
-- Table structure for table `emailverification`
--

CREATE TABLE `emailverification` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `expires` int(11) NOT NULL,
  `email` text NOT NULL,
  `token` text NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `emailverification`
--

INSERT INTO `emailverification` (`id`, `created`, `expires`, `email`, `token`, `userid`) VALUES
(41, 1682092144, 0, 'josephshackleford04@icloud.com', 'a3b66c242d8e29bbe2627c37ae2483f838f4f46ee4087adda5359799af1e10c46cc636add426716330031a7305c0830c9230778f6ed92c9cd6b513f48c56503b94abe0b50bb61ea645d90ff037b135efddcc9040103235445dd989befe0e1718e3143f96539bee560bd46fafb67fbc4af9471f1accd82933a4db0939085db012', 3),
(42, 1682092489, 0, 'josephshackleford04@icloud.com', '2cfddd9b7eeb33aab6a0ec86929d5cfb96515a192a1eb3f2fea44c7ab8361c69c33515fe82011e243f06240979d5a3963f964b99e11fe24111f08af373d689055df35a5e428ee6d82e40ba22ea9ba401247b63a9d5560ea7c0fd628668f0beb662f612fa5edf89fe5c3c1f115ba6b01fadc16b246d19557de6015472942c3604', 3),
(43, 1682092663, 0, 'josephshackleford04@icloud.com', '2c79a88cdd4a2ea61b77d2749e50901c059a92ad7ce5cb3ac21913e433b7ee1e815012929dec2be2890bb8ebe10d171cc680f25953f628d04dc87ca9c743d8815ea82848b0a7bc71211ccdbb07834713293530bc08030afd17c33f515542b736b560f3138facc80e7e5e7e3dec2f4c682a3f1bb0d7cc2247eba6bc66096121fc', 3),
(44, 1682092679, 0, 'josephshackleford04@icloud.com', 'ed51fbcb9c2af439f95243e2e20c512825b3953ce079af5097a518d0aca9d6b297ee9ecd7b296b1da43da222f737cdd89e19485adb0133afb54ffd9f8ea7b1ec5c22b899a5e1587ae25b7e258d866baf7a658d1e24effac9dc112bca47ebc4d9b0aed425d59a86a31f5ff708bc9cae77cbb98cb4c00543bb55ec60b8c6590dbf', 3),
(45, 1682093558, 0, 'josephshackleford04@gmail.com', '2b3986879ea7cf029371763d0e3708f7e98cc37768c7254b0f6466279378e5a32f2a60270ea667be4a225b72b6fe01595790dbd9ec037e9270b792c7989c879a76cb439e482dfd354b6a3f40d2ee662cb74024f434b3bec5d0ad5bf2778203be3c4e8dcc2848f113df286dcac8d53e14f8385d7f8df8a08898fc1e35692a58eb', 3),
(46, 1682093566, 0, 'josephshackleford04@gmail.com', '582447f26e00acba6ecfbd91de225ae2ce289263894646dcb1d21013d9969a3b69952c8f6aec397a54a2fde15913b010dd2fe812440b4019957c95dc41f0fc32ba69315028e4fc4739f96772461eb730654d7cddeffe696512ff8ecc6cdc230f8e35e05a6306931ed6cfecff40b9ef387e4672ba2f3a1228d99fdaf77b877308', 3),
(47, 1682093572, 0, 'josephshackleford04@gmail.com', 'd7762b38d28a9ceeeea5b6cc0c129766673a0fc097b4fd7957591cc3cd10dafbd0faf9c7a396cd3a6fa5966ee707976492f2e06cd2e578e5eaa9affb43582e29e9fa2a918e8ad10b180c7fbc88d42037693367d1e045c7be0dd7b0dac13d04945ce2e3f2e0fb4c131f4b47c7381401b60a755a32da5b8fd5431f7bd3126e3ea4', 3),
(48, 1682093577, 0, 'josephshackleford04@gmail.com', 'b9b2b4ff3d11895fa5f4195acc56bc8e1ec3403e7ecf5b7908cfad641374aee75fdfd6af4baf42e5a799c25d9bac02ae53ab3945f897c61875933d4e87d8ecc51f7699bd38675d51eca7eb5dd1c4a7dd25a64f14b7802e133ff035d9593e11a7f4e65fb208650345fc0cb4dc25daa711b97aa45d9fa4a964efc558970ade3e16', 3),
(49, 1682093581, 0, 'josephshackleford04@gmail.com', '8776a4750db73adc81690be94058b9a416f424a5b442bca992d9772b69ef39925411f69188fe0a1c8f4c6e0efd3ec75684ab303f06546b9bd43609088922c693299eb2d2497c8b11182d70f85366d14b920f9f5889ebe542af7f19ea312f62a9604b0b075fe3a32060497bbb5aeed6b55924d8860161f70799a10e6f7149623c', 3),
(50, 1682094166, 0, 'support@youcc.xyz', 'e283c4f43b0630697bdf2d8b20907258541d7733e49a5bf7ee4668d5030ea1aef96a017ec4031d904c59cb9eea757c0e03250ccda440a17a3b364a9d8228aeeaf8d6bfa69fb0cc85f6f0377d4605cf8550548db7be4835d1668671046f68e0b679deca28808085ef86426c0a5e521f283d5ce7fc8578b0c52871e995d5d18a6a', 3),
(51, 1682189516, 1682191316, 'josephshackleford04@icloud.com', 'e8b22b3ed5e8e4e24f884c39ccff4b638e02cf5aff14f840c9a877736ed3ca6bd6e2324d605db5705a0d2778c375caf690db1d9790a55208ee6a7c42306d065c39cb0fd816e8f7354b5d69eae5dd812ed2548e96ce240a6ec9507dbb886454e1e106964f5dcecb67cf6519926a2e092b013f9d1566efb74439bd8177fd45ea21', 5);

-- --------------------------------------------------------

--
-- Table structure for table `postrestrictions`
--

CREATE TABLE `postrestrictions` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `postid` int(11) NOT NULL,
  `countries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `reason` text NOT NULL,
  `regions` longtext NOT NULL DEFAULT '[]',
  `hidecontent` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `postrestrictions`
--

INSERT INTO `postrestrictions` (`id`, `created`, `postid`, `countries`, `reason`, `regions`, `hidecontent`) VALUES
(1, 0, 1, '[\"*\"]', 'Post may content offensive or hateful content', '[]', 0);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `content` text NOT NULL,
  `deleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `created`, `userid`, `content`, `deleted`) VALUES
(1, 0, 3, 'Hello World!', 0),
(2, 1681610907, 3, 'Testing', 1),
(3, 1681613211, 3, '0', 1),
(4, 1681932662, 3, 'Hello World!', 0),
(5, 1681932710, 3, 'Hello World 1', 0),
(6, 1681932713, 3, 'Hello World 2', 0),
(7, 1681932716, 3, 'Hello World 3', 0),
(8, 1681932718, 3, 'Hello World 4', 0),
(9, 1681932720, 3, 'Hello World 5', 0),
(10, 1681932723, 3, 'Hello World 6', 0),
(11, 1681932725, 3, 'Hello World 7', 0),
(12, 1681932727, 3, 'Hello World 8', 0),
(13, 1681932729, 3, 'Hello World 9', 0),
(14, 1681932732, 3, 'Hello World 10', 0),
(15, 1681932734, 3, 'Hello World 11', 0),
(16, 1681932736, 3, 'Hello World 12', 0),
(17, 1681932738, 3, 'Hello World 13', 0),
(18, 1681932740, 3, 'Hello World 14', 0),
(19, 1681932742, 3, 'Hello World 15', 0),
(20, 1681938411, 3, 'Spam                 Spam', 1),
(21, 1681939008, 3, '1\\n2\\n3\\n4', 0),
(22, 1681953783, 3, '1\n2\n3\n4', 0),
(23, 1681954111, 3, 'This is normal text\n[b]This is bold text[/b]\n[i]This is italic text[/i]\n[u]This is underlined text[/u]\n[b][i][u]This is a full combination![/b][/i][/u]', 1),
(24, 1681956196, 3, 'This is normal text\n[b]This is bold text[/b]\n[i]This is italic text[/i]\n[u]This is underlined text[/u]\n[b][i][u]This is a full combination![/b][/i][/u]\nTh[b]is is stran[/b]ge', 0),
(25, 1682099473, 3, 'test', 0),
(26, 1682099532, 3, 'test2', 1),
(27, 1682120523, 5, 'hey guys', 0),
(28, 1682120573, 3, 'hey john! hope you&#x27;re well. what&#x27;s up?', 0),
(29, 1682120585, 5, 'just chilling, wbu?', 0),
(30, 1682295176, 3, 'testpost', 0),
(31, 1682295238, 3, 'testpost', 0),
(32, 1682295664, 3, 'rhbawrfgbfrg', 0),
(33, 1682295696, 3, 'gasewdgvsderfgv', 0);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `type` text NOT NULL,
  `relation` int(11) NOT NULL,
  `rule` text NOT NULL,
  `message` text NOT NULL,
  `userid` int(11) NOT NULL,
  `method` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `email` text NOT NULL,
  `emailverified` tinyint(4) NOT NULL DEFAULT 0,
  `suspended` tinyint(4) NOT NULL DEFAULT 0,
  `verified` tinyint(4) NOT NULL DEFAULT 0,
  `dob` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created`, `username`, `password`, `email`, `emailverified`, `suspended`, `verified`, `dob`) VALUES
(3, 1681421945, 'joseph', '$argon2id$v=19$m=65536,t=3,p=4$5Y2TENEvqemS9PuWMjMZzQ$qB7noUewbFM4UEIorqHaxCaBRucplWOKHVxJ5wiH59I', 'support@youcc.xyz', 1, 0, 0, 1093305600),
(5, 1681700111, 'johndoe', '$argon2id$v=19$m=65536,t=3,p=4$GU2QmwKKeRL8T3sjqKZ8YQ$qUxhGpKz9LALr5WJuspwesh2TkdP+rKEqyDe5JGcExY', 'josephshackleford04@icloud.com', 0, 0, 0, 1093305600),
(6, 1681700222, 'josephs', '$argon2id$v=19$m=65536,t=3,p=4$w0znNhfjZ68ErmEoFwC04w$9scfAUY5T7jOPcaegpFTahJcNSF8shRfkWckwv2I52s', 'email@email.com', 0, 0, 0, 1093305600);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emailverification`
--
ALTER TABLE `emailverification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `postrestrictions`
--
ALTER TABLE `postrestrictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postid` (`postid`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emailverification`
--
ALTER TABLE `emailverification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `postrestrictions`
--
ALTER TABLE `postrestrictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `postrestrictions`
--
ALTER TABLE `postrestrictions`
  ADD CONSTRAINT `postid` FOREIGN KEY (`postid`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
