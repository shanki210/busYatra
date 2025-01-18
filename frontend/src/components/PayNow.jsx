import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, FormControl, FormLabel, Input, Button, Heading, Flex, useToast, SlideFade } from "@chakra-ui/react";
import axios from 'axios';

const PayNow = () => {
  const [name, setName] = useState("");
  const [cardNum, setNumber] = useState("");
  const [cvv, setCcv] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { seatId } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast({
        title: "Payment Successful",
        description: "Your payment has been completed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
          `http://localhost:8080/book/${seatId}`, { userId: user._id },
          config
        );
        
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
      navigate(`/cart?bookSeat=${seatId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <SlideFade in={true}>
        <Box p="8" rounded="lg" boxShadow="lg" bg="white" width={{ base: "90%", md: "100%" }}>
          <Heading as="h1" mb="6" textAlign="center">Fill Payment Details</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="cardNumber" mb="4">
              <FormLabel>Number on Card</FormLabel>
              <Input type="password" value={cardNum} placeholder='Enter Card Number' onChange={(e) => setNumber(e.target.value)} />
            </FormControl>
            <FormControl id="cardHolderName" mb="4">
              <FormLabel>Name of Card Holder</FormLabel>
              <Input type="text" value={name} placeholder='Enter Card Holder Name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="cvv" mb="4">
              <FormLabel>CVV</FormLabel>
              <Input type="password" value={cvv} placeholder='Enter CVV' onChange={(e) => setCcv(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="green" width="full">Pay</Button>
          </form>
        </Box>
      </SlideFade>
    </Box>
  );
};

export default PayNow;
