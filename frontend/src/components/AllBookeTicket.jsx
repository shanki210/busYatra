import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, Button, Flex, Heading, Text, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, useToast, Divider } from "@chakra-ui/react";
import Header from "./Header";

const AllBookedTicket = () => {
  const [bookedTicket, setBookedTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function fetchBookedTicket() {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = user.token;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const tickets = await axios.post(
          `http://localhost:8080/book`,
          { userId: user._id },
          config
        );
        setBookedTicket(tickets.data);
        setLoading(true);
      } catch (error) {
        toast({
          title: "Error fetching tickets",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    fetchBookedTicket();
  }, [book]);

  async function cancelTicket(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(`http://localhost:8080/book/${id}`, config);
      setBook(!book);
      toast({
        title: "Ticket Cancelled",
        description: "Your ticket has been cancelled successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error cancelling ticket",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (

    <Box minH="100vh" bg="gray.100">
      <Header />
      <Flex
        ml={{ base: 0, md: "250px" }}
        direction="column"
        align="center"
        justify="center"
        p="5"
      >
          <Box minH="100vh" p={5} bg="gray.50">
            <Heading as="h1" mb={6} textAlign="center" color="teal.600">
              All Booked Tickets
            </Heading>
            <VStack spacing={4} align="stretch">
              {loading && bookedTicket.length > 0 ? (
                bookedTicket.map((item) => (
                  <Box key={item._id} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
                    <HStack justify="space-between">
                      <VStack align="flex-start">
                        <Text fontSize="lg" fontWeight="bold">Bus Name: {item.busId.name}</Text>
                        <Text>From: {item.busId.from}</Text>
                        <Text>To: {item.busId.to}</Text>
                        <Text>Price: ${item.busId.price}</Text>
                        <Text>Seat No: {item.seatNo}</Text>
                      </VStack>
                      <Button colorScheme="red" onClick={() => cancelTicket(item._id)}>Cancel Ticket</Button>
                    </HStack>
                    <Divider mt={4} />
                  </Box>
                ))
              ) : (
                <Text fontSize="xl" textAlign="center" color="gray.600">No booked tickets available.</Text>
              )}
            </VStack>
          </Box>
      </Flex>
    </Box>

    
  );
};

export default AllBookedTicket;
