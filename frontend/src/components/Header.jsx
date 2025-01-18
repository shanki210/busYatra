import React from 'react';
import { Link } from "react-router-dom";
import { Box, VStack, Heading, Text, HStack, Image } from '@chakra-ui/react';
import { FaHome, FaShoppingCart, FaTicketAlt, FaUser, FaSignOutAlt,FaIdCard } from "react-icons/fa";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/cart", label: "Cart", icon: <FaShoppingCart /> },
    { path: "/bookedticket", label: "Booked Tickets", icon: <FaTicketAlt /> },
    { path: "/driver/kyc", label: "Driver KYC", icon: <FaIdCard /> },  // New Driver KYC button

  ];

  return (
    <Box
      as="aside"
      w={{ base: "60px", md: "250px" }}
      bg="blue.600"
      color="white"
      h="100vh"
      p="4"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="fixed"
    >
      <VStack spacing="8" align="stretch">
        <Box textAlign="center">
          <Image src="/logo.png" alt="BusYatra Logo" boxSize="50px" mx="auto" />
          <Heading
            as="h1"
            size="lg"
            fontSize="2xl"
            color="yellow.300"
            textAlign="center"
            animation="pulse 2s infinite"
          >
            <Text as="span" fontWeight="bold">B</Text>
            <Text as="span" className="animateText">us</Text>
            <Text as="span" fontWeight="bold">Yatra</Text>
          </Heading>
        </Box>
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <Box
              as="div"
              _hover={{ bg: "blue.700" }}
              p={4}
              borderRadius="md"
              display="flex"
              alignItems="center"
            >
              <HStack spacing={4}>
                {item.icon}
                <Text fontSize="lg">{item.label}</Text>
              </HStack>
            </Box>
          </Link>
        ))}
       
      </VStack>

      <VStack spacing="4">
        {user ? (
          <Box
            as="div"
            _hover={{ bg: "red.500" }}
            p={4}
            borderRadius="md"
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={handleLogout}
          >
            <HStack spacing={4}>
              <FaSignOutAlt />
              <Text fontSize="lg">Logout</Text>
            </HStack>
          </Box>
        ) : (
          <Link to="/login">
            <Box
              as="div"
              _hover={{ bg: "yellow.500" }}
              p={4}
              borderRadius="md"
              display="flex"
              alignItems="center"
            >
              <HStack spacing={4}>
                <FaUser />
                <Text fontSize="lg">Login</Text>
              </HStack>
            </Box>
          </Link>
        )}
        {user && (
          <Text fontSize="md" textAlign="center" fontWeight="bold">
            {user.name}
          </Text>
        )}
      </VStack>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.8; }
          }
        `}
      </style>
    </Box>
  );
};

export default Header;
