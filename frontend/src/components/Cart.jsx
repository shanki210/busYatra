import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Navigate, Link } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Flex, Heading, useToast } from "@chakra-ui/react";
import Header from "./Header";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = user.token;
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const seats = await axios.post(
          `http://localhost:8080/cart`,
          { userId: user._id },
          config
        );
        setCart(seats.data);
        setLoading(true);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    fetchCart();
  }, [book]);

  async function bookSeat(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

   
   
      try {
        await axios.post(
          `http://localhost:8080/book/${id}`, { userId: user._id },
          config
        );
        setBook(!book);
        toast({
          title: "Success",
          description: "Ticket has been booked",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    
  }

  async function cancelSeat(id) {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(
        `http://localhost:8080/cart/${id}`,
        config
      );
      setBook(!book);
      toast({
        title: "Success",
        description: "Ticket has been removed from Cart",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handlePayment = (id) => {
    navigate('/pay', {
      state: { seatId: id },
    });
    
  };

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
        <Box padding="5">
          <Heading as="h1" mb="5" textAlign="center">
            My Cart
          </Heading>

          <Flex justify="center" mb="4">
            <Link to="/bookedticket">
              <Button size="lg" mx="2">
                See Booked Ticket
              </Button>
            </Link>
          </Flex>

          <Box overflowX="auto">
            {loading && (
              <Table variant="simple">
                <Thead bg="blue.500" color="white">
                  <Tr>
                    <Th>BUS NAME</Th>
                    <Th>FROM</Th>
                    <Th>TO</Th>
                    <Th>PRICE</Th>
                    <Th>SEAT NO</Th>
                    <Th>ACTION</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cart.map((item) => (
                    <Tr key={item._id}>
                      <Td>{item.busId.name}</Td>
                      <Td>{item.busId.from}</Td>
                      <Td>{item.busId.to}</Td>
                      <Td>${item.busId.price}</Td>
                      <Td>{item.seatNo}</Td>
                      <Td>
                        
                          {/* <Button colorScheme="green" mx="2" onClick={() => bookSeat(item._id)}>
                            Book
                          </Button> */}
                          <Button colorScheme="green" mx="2" py='1.5' onClick={() => handlePayment(item._id)}>Pay & Book</Button>

                        <Button colorScheme="red" mx="2" onClick={() => cancelSeat(item._id)}>
                          Remove
                        </Button>
                        {/* <Link to="/pay">
                          <Button colorScheme="green" mx="2">
                            Book
                          </Button>
                        </Link> */}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
    
  );
};

export default Cart;
