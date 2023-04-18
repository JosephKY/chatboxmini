-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 18, 2023 at 04:40 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emailverification`
--

INSERT INTO `emailverification` (`id`, `created`, `expires`, `email`, `token`, `userid`) VALUES
(1, 1681479255, 0, 'josephshackleford04@icloud.com', '3b667366ce0a2233e6f8121c46a3e25cface2b1afc87790195c852c7b240a4e135f8d216f0c65bd632c40bbf8d4ca2e23ce69a462f05e261d4a034f6c367c26651b8cf2fb5fe8b171d372675d1fed7ec8c0e0e40a7046686258f7d24f06957c699ec5f47459e71b99566a11f8e681bec17902171586b65f13814caf0b9bf592a', 7),
(2, 1681479296, 0, 'josephshackleford04@icloud.com', '86a31034e3b71bf2301197435e35c3622fce5353929d9a39e6a43495f5917a419a9e2c34adb6621a28016d4787cdad311d990fb30611c1016b62e26f3a7ed73cb82838d953e71bad8e54ee8877a2ce2f78df3bd4d8f59e358a4c361da6470cc069bf4e8dfeca48480071cdbe0c987535058abb8565f12a2f5454c5b51330d9db', 7),
(3, 1681480269, 0, 'josephshackleford04@icloud.com', 'd84f733b27c1ff51bf33c3a87e9ffc8ae876c6bc954aa7ba18f2c45e20febab640756ae4075b6a3cd31b85184aa0c01d839d7ae86b1de375775fe22a9468fd4f480091821d7a4a04825406f966d269e87b0638e0ae92361a2336c60306cceacfe8d5891c5855a7585adb5bacb411a42ece576ee0921dce5960ede041454c802a', 7),
(4, 1681480336, 0, 'josephshackleford04@icloud.com', '71042610532eceac70e4269dd09adae9fdd934a79b202f8412262e820ce8872fe4bb0fdaed752fdcf4071e5925a7c1790f1ac602da67f2aefc709f157c303c51f19c6ad15099aafcce0fba1bc7c589bd20e53af8630f886cacea711c8e702625ce4b625bac8027ae22acb436323b49d1009c8b2a318fde171e06f57b8f397937', 7),
(5, 1681481337, 0, 'josephshackleford04@icloud.com', '14ca41d53f29257132b40b7c1bebf6678a6b39e9507452434fe192dcf075e74562ff82c3eccd6c15716f45bdbdb1f4290b05f45dd3c273db5e4d76fcba31fe8fe5df08f99172b2df4e126cab27836fb0f55cba7e994bcdbee81e715ab6b68e946040c9428dd8a374ca1524cab9df562519b6e66fa49932916089a5bfd981b3d2', 7),
(6, 1681481474, 0, 'josephshackleford04@icloud.com', '9afe23bb66ed76759a96afc2aefedb87582dc08e1fba04c2415eb93000269040ce40a2b48ad5d55ff6f405730998bb9ac4be8b629e4e4611ec9728049a537c1c3f8d2de9451dd7a88f65415f28914ae1ae75773839f3bad343bc38f71943216507fbb6d526259da55a6c19965afb7d7edeb0900d5cf671de8d3f589670031549', 7),
(7, 1681492544, 0, 'josephshackleford04@icloud.com', 'e378f46bfd0474b8a036b6b356dcf488859ed612ae90fd2d8284fcdae4661eadcfb707acb56fc5ec892f338c63d68b636dec115b387cd98e8fd7accc0270d0b30006a0eced60dc0d92b7b16c09b7ec99219ab9a64282502050dad922f33bf715976b8c91ce38b38055e454d4943c22852749e7afa17c5087ea942922208ac45f', 7),
(8, 1681493451, 0, 'josephshackleford04@icloud.com', 'bf6a4b119ab9ddb88f9c846979747d415d499bd943db3c64efa2165d831aad764938de08221adfac5cc9780829c07dbc8cbe1a4e016511ae6267ba9da1d0a64983e20d247115803f313e8f92a715ea1c9fbe4c2b0533a39ad20b2ea38f07cbb2f53f4381857e25e05702f2accb7e2d9f888a41322dd1549de8204ada922155fc', 7),
(9, 1681493606, 0, 'josephshackleford04@icloud.com', 'db42317569353b7d587a7a530a94d64a7116fcc70a6d4b6215bebed7dffe327c3cb2ea65879a3a42a7e8f0454fe5cea482496d706192ba08b69ad6187d22a455b4c7270c09b496fdf38677ebfe7cad763d117447ffb3fe10682c3325f44c18ff75fc7c303816d77dadb623d87fddb5e830651e0f42ed3f16abb85d10fa70deb6', 7),
(10, 1681493665, 0, 'josephshackleford04@icloud.com', '226e7ca4131a9b8f644e135e75038e0239cd80a55fd19020d59eae9aec7b35e021fe7d815cfe6496a5fdfec0121af271d097606e47cb96c7d0cf8663112e996699660536e04e6384ead310feb0f166c2bcdee193e633eec7d5cbd394a26de8c30083f360359ffc0b0e0ddba5d8e93f33ab14dca87cdbe850b2a464d73124b1ae', 7),
(11, 1681493704, 0, 'josephshackleford04@icloud.com', '29516c5c3ac65394af88269924d9b43a49beb619cda710133845ed1b272c02268494911f17e14ebe7e794f6d9dd33e602dd19a56ff20649b7fda4446a68fa062be72eccf79b71083663fccd69093e3be39b2809b447d60163b8b40910ccf82e722473abc5ea66818c557fee48e6026c7db69da1b2fbbd572a1dd2defb386da5d', 7),
(12, 1681493767, 0, 'josephshackleford04@icloud.com', '482a33eac502cbfbbaa124e3fdb411a397cc8cc57860e9e97380fd7664ee264ae5fd333c8f662c2ac7f760178b809ad0bcccc9e70ecf63e7d2039776ab5fc7d410b50de6cc17a2254ba83a58c713b66cc63fd813d5242eaf195e1cce3628951c2e3ffe6276294d95c9cc4a5a42df14003932a13d4bdfe7564712d18f444803bf', 7);

-- --------------------------------------------------------

--
-- Table structure for table `postrestrictions`
--

CREATE TABLE `postrestrictions` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `postid` int(11) NOT NULL,
  `countries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`countries`)),
  `regions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`regions`)),
  `hidecontent` tinyint(4) NOT NULL DEFAULT 1,
  `reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `postrestrictions`
--

INSERT INTO `postrestrictions` (`id`, `created`, `postid`, `countries`, `regions`, `hidecontent`, `reason`) VALUES
(1, 0, 13, '[\"*\"]', '[]', 1, 'Testing');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `created`, `userid`, `content`) VALUES
(1, 0, 6, 'Hello World'),
(2, 0, 6, 'Hello World 2'),
(3, 0, 6, 'Hello World 3'),
(4, 0, 6, 'Hello World 4'),
(5, 0, 6, 'Hello World 5'),
(6, 0, 6, 'Hello World 6'),
(7, 0, 6, 'Hello World 7'),
(8, 0, 6, 'Hello World 8'),
(9, 0, 6, 'Hello World 9'),
(10, 0, 6, 'Hello World 10'),
(11, 0, 6, 'Hello World 11'),
(12, 0, 6, 'Hello World 12'),
(13, 0, 6, 'Hello World 13'),
(14, 0, 6, 'Hello World 14'),
(15, 0, 6, 'Hello World 15'),
(16, 0, 6, 'Hello World 16'),
(20, 0, 6, 'Hello World 17'),
(21, 0, 6, 'Hello World 18'),
(22, 0, 6, 'Hello World 19'),
(23, 0, 6, 'Hello World 20');

-- --------------------------------------------------------

--
-- Table structure for table `reset`
--

CREATE TABLE `reset` (
  `id` int(11) NOT NULL,
  `created` int(11) NOT NULL,
  `expires` int(11) NOT NULL,
  `token` text NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reset`
--

INSERT INTO `reset` (`id`, `created`, `expires`, `token`, `userid`) VALUES
(1, 1681823875, 1681824475, '955c830c1e60e36bb0a8e68be73f11b94b6b88a932ddc262ca39b1dfad644942e8d3de8a8e0a8c9c1e6eb00d03d10f87a7bdd103d847ff8278ea3653a2be04a5e766c4ed8648710023d4a06e32a7f03208f7adb00a2f5015bf2c7512102dc07536ead28a0745aa0c7cbad31f383012da6ef1a7ef8702bf27ecb520921431c9d3', 6),
(2, 1681824026, 1681824626, '91ff9cddfa84b2b0c9c6cfbb4d6c3bf5d217a89dc2052749c7dca0d4a285c2684151420e884cf261593024e01cac6bc516d0570fc49a4b49e3ce11e87a6954b204dcd5796246c6ca418fef9a33c722728640ae0943023c80a88a8e245151146600d017528d5d1263fab4b5c2fc6e43cbce0be1829e87dd4d7ba7940d2cd69799', 6),
(3, 1681824158, 1681824758, '48c0bd103dfe7db54ad91926d805910788b2e9b9b9ea265ce36ec5d112093dcea4aee69d437b4e7c0c26126857d4c71468c6c6aceb9d5e3671bc9ea6410799dc0f6076dc84dba5f22fd2d1b50e855f0b6e6f50a045dbaefc5df4b171292f7a545642825f45f1531bf63253d464141fd90490d753a2611ef479743288cc790d15', 6),
(4, 1681826486, 1681826820, '299fa5839e2636569556be34b904e7d8b856269a282815fb4e09499e2031282c1fc2e7ac43a392a271a74a9687eab1bfccf962f3833d9273cdc6d6478e5ceb63c7d1988d6d6168e9d741bb35558ecc5ac6721c51a98215e3aac5a29823188a768a9123fb479bb7abc2604e5ddcb9ff5ebeaaa755810437235dcdc0749a875f6b', 6),
(5, 1681827590, 1681828190, 'ab2dcce828803c76183d604552cc2e336247de5129a6aac28062dd342b6fb0194f8a4247951d1e3ffc98ee46b9db77d90efe40e6035f6b6cffffda4461eca9542a0c4a8e8548bb6be378d61cb1a9886bd2630c840dd6b13c4823a447a8759d06a353054011a4e5292a37df97d2500a215f8da3fd530c0434a041c9f57f31dce6', 6),
(6, 1681827608, 1681828208, '5d0c0c450782577b6dfb06506696b458991a8d264713b35749fdd4f6bab6ad924e921db324084efa1bd6d5a8932d8acb46df477ad574a4a126b223fb6986561f4ff8a6fa95ac020b1ffdafeedbae8494730d1abf8200320d10d9d119035fccc1a33fc1386fe21d9c8f42e94e2e96512f69894c4b1e73241afb65242d9212f5f0', 6),
(7, 1681828651, 1681828689, 'b13bb6ad548877d2a040de8c570dd8a61dade221efbf40bae8c47e66105b5e0e3cad4abcfb8382c831e6d3c3e2fe3db0a1a791feb59c693bfca459f1621188933a73355101461f70e46649ec9dc27aad920bc7c8c315c40ad05adc631da145f6a08aa18d04eccea1e487affd919bddac2d830f9ca7f750870481c3f4886a5b39', 6);

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
  `verified` int(11) NOT NULL DEFAULT 0,
  `suspended` tinyint(4) NOT NULL DEFAULT 0,
  `dob` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created`, `username`, `password`, `email`, `emailverified`, `verified`, `suspended`, `dob`) VALUES
(6, 1681393844, 'admin', '$argon2id$v=19$m=65536,t=3,p=4$RHtWbzjByxBnDMJ+uHQTeQ$+b7PKBNE3NeQvxo4xexTWv0pNFvwjS9n1AoAFInHn7I', 'josephshackleford04@gmail.com', 1, 1, 0, 0),
(7, 1681395209, 'johndoe', '4f3f1162d44eb1381bba55dd055eae82d15bae7b5656b5ef0043ede39c9bdee3319b99e004344a82b8453ce72a94169ea73bfd687dddced27e7c53ddab36b177', 'josephshackleford04@icloud.com', 1, 0, 0, 0),
(8, 1681820086, 'username', '$argon2id$v=19$m=65536,t=3,p=4$TavnRHFhzpUHJGDYyWDmYw$+Qf8DA/v6jsEmiX3heEMTefU6EST40x41bTvk9ZxP90', 'email@email.com', 0, 0, 0, 948672000);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reset`
--
ALTER TABLE `reset`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `postrestrictions`
--
ALTER TABLE `postrestrictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `reset`
--
ALTER TABLE `reset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
