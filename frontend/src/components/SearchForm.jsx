import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";

const SearchForm = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({ from: "", to: "" });

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "http://localhost:8080/bus/search",
          searchCriteria,
          config
        );
        setBuses(data);
      } catch (error) {
        alert("Error fetching buses!");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [searchCriteria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchCriteria({ from: fromCity, to: toCity });
  };

  return (
    <Box
      p="5"
      bg="white"
      boxShadow="lg"
      borderRadius="lg"
      w={{ base: "90%", md: "60%" }}
      mx="auto"
      mb="8"
    >
      <form onSubmit={handleSubmit}>
        <Flex direction={{ base: "column", md: "row" }} gap="4" mb="4">
          <Input
            placeholder="From City"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            size="lg"
            bg="gray.50"
          />
          <Input
            placeholder="To City"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            size="lg"
            bg="gray.50"
          />
          <Button type="submit" colorScheme="blue" size="lg">
            Search
          </Button>
        </Flex>
      </form>

      {loading && (
        <Flex justify="center" my="4">
          <Spinner size="xl" />
        </Flex>
      )}

      {buses.length > 0 && (
        <Box>
          <Heading as="h3" size="lg" mb="4" textAlign="center">
            Available Buses
          </Heading>
          <Table variant="simple" colorScheme="blue" size="md">
            <Thead>
              <Tr>
                <Th>Bus Name</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {buses.map((bus) => (
                <Tr key={bus._id}>
                  <Td>{bus.name}</Td>
                  <Td>{bus.from}</Td>
                  <Td>{bus.to}</Td>
                  <Td>
                    <Link to="/seatbook">
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() =>
                          localStorage.setItem("item", JSON.stringify(bus))
                        }
                      >
                        Check
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default SearchForm;
