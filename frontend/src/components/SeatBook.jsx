import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Grid,
  GridItem,
  Flex,
  useToast,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Header from "./Header";

const SeatBook = () => {
  const [seats, setSeats] = useState({});  // Initialize as an object
  const [chooseSeat, setChooseSeat] = useState(null);
  const toast = useToast();

  useEffect(() => {
    async function fetchSeats() {
      let user = JSON.parse(localStorage.getItem("item"));
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      try {
        const response = await axios.get(
          `http://localhost:8080/bus/search/${user._id}`,
          config
        );
        setSeats(response.data.seats);  // Assume response.data.seats is an object { 1: false, 2: true, ... }
      } catch (error) {
        toast({
          title: "Error fetching seats",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    fetchSeats();
  }, []);

  async function addToCart(sno) {
    let user = JSON.parse(localStorage.getItem("user"));
    let bus = JSON.parse(localStorage.getItem("item"));
    let token = user.token;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.post(
        "http://localhost:8080/cart/add",
        {
          userId: user._id,
          busId: bus._id,
          seatNo: sno,
        },
        config
      );

      setSeats((prevSeats) => {
        return {
          ...prevSeats,
          [sno]: true,  // Lock the seat
        };
      });

      toast({
        title: "Seat added to cart",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding seat to cart",
        description: error.message,
        status: "error",
        duration: 3000,
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
        <Flex direction="column" alignItems="center" p="6">
          <Flex justifyContent="space-between" alignItems="center" mb="6" w="100%">
            <Heading as="h1" size="lg">
              Seat Booking
            </Heading>
            <Link to="/cart">
              <Button colorScheme="blue" size="lg">
                My Cart
              </Button>
            </Link>
          </Flex>
          <Box
            bg="gray.50"
            p="6"
            borderRadius="md"
            boxShadow="lg"
            maxWidth="600px"
            w="100%"
          >
            <VStack spacing="4">
              <Grid
                templateColumns="repeat(2, 1fr) 0.5fr repeat(2, 1fr)"
                gap="4"
                justifyContent="center"
              >
                {/* Driver Seat */}
                <GridItem colSpan={5} textAlign="center">
                  <Text fontWeight="bold" bg="yellow.200" p="2" borderRadius="md">
                    Driver
                  </Text>
                </GridItem>

                {/* Rows of Seats */}
                {Array(10).fill(0).map((_, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {[0, 1, 2, 3].map((seatOffset) => {
                      const seatIndex = rowIndex * 4 + seatOffset + 1;  // Seat numbers start from 1
                      return (
                        <GridItem key={`seat-${seatIndex}`}>
                          <Button
                            w="100%"
                            h="50px"
                            bg={seats[seatIndex] ? "red.500" : "green.500"}
                            color="white"
                            _hover={{
                              bg: seats[seatIndex] ? "red.600" : "green.600",
                            }}
                            isDisabled={seats[seatIndex]}
                            onClick={() => {
                              setChooseSeat(seatIndex);
                              addToCart(seatIndex);
                            }}
                          >
                            {seats[seatIndex] ? "Booked" : `Seat ${seatIndex}`}
                          </Button>
                        </GridItem>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Grid>
            </VStack>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SeatBook;
