import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Flex,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaSyncAlt } from "react-icons/fa";  
import { useNavigate , Link} from "react-router-dom"; // Import useNavigate for routing

import axios from "axios";

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [bus, setBus] = useState({
    name: "",
    from: "",
    to: "",
    price: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear token from localStorage
    navigate("/login"); // Redirect to login page
  };

  const handleResetSeats = async (busId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:8080/admin/reset/${busId}`, {}, config);
      setFilteredBookings([]);
      toast({
        title: "Seats reset successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchBuses();
    } catch (error) {
      toast({
        title: "Error resetting seats",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchBookingsByBus = async (busId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`http://localhost:8080/admin/bookings/${busId}`, config);
      setFilteredBookings(data);
      if(data.length<=0){
        toast({
          title: "No bus bookings",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: "Error fetching bus bookings",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchBuses = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get("http://localhost:8080/admin/bus", config);
      setBuses(data);
    } catch (error) {
      toast({
        title: "Error fetching buses",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleChange = (e) => {
    setBus({ ...bus, [e.target.name]: e.target.value });
  };

  const handleCreateBus = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditing) {
        await axios.put(`http://localhost:8080/admin/bus/${editingId}`, bus, config);
        toast({
          title: "Bus updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8080/admin/create", bus, config);
        toast({
          title: "Bus created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setBus({ name: "", from: "", to: "", price: 0 });
      fetchBuses();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (bus) => {
    setBus(bus);
    setIsEditing(true);
    setEditingId(bus._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:8080/admin/bus/${id}`, config);
      toast({
        title: "Bus deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchBuses();
    } catch (error) {
      toast({
        title: "Error deleting bus",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="8" maxW="1000px" mx="auto">
      <Flex justify="space-between" align="center" mb="4">
        <Heading textAlign="center">Admin Dashboard</Heading>
        <Link to="/driver/kyc">
          <Button colorScheme="blue">Driver KYC</Button>
        </Link>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
      <Box mb="8" p="6" boxShadow="md" borderRadius="md" bg="gray.50">
        <Flex gap="4" direction={{ base: "column", md: "row" }}>
          <Input
            name="name"
            placeholder="Bus Name"
            value={bus.name}
            onChange={handleChange}
          />
          <Input
            name="from"
            placeholder="From"
            value={bus.from}
            onChange={handleChange}
          />
          <Input
            name="to"
            placeholder="To"
            value={bus.to}
            onChange={handleChange}
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={bus.price}
            onChange={handleChange}
          />
        </Flex>
        <Button
          mt="4"
          colorScheme={isEditing ? "orange" : "blue"}
          onClick={handleCreateBus}
        >
          {isEditing ? "Update Bus" : "Create Bus"}
        </Button>
      </Box>

      <Box boxShadow="md" borderRadius="md" bg="white" p="6">
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Bus Name</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Price</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {buses.map((bus) => (
              <Tr key={bus._id}>
                <Td>
                  <Button variant="link" onClick={() => fetchBookingsByBus(bus._id)}>
                    {bus.name}
                  </Button>
                </Td>
                <Td>{bus.from}</Td>
                <Td>{bus.to}</Td>
                <Td>${bus.price}</Td>
                <Td>
                  <Flex gap="2">
                    <IconButton icon={<FaEdit />} colorScheme="yellow" onClick={() => handleEdit(bus)} />
                    <IconButton icon={<FaTrash />} colorScheme="red" onClick={() => handleDelete(bus._id)} />
                    <IconButton icon={<FaSyncAlt />} colorScheme="blue" onClick={() => handleResetSeats(bus._id)}/>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>

        </Table>
      </Box>
      {filteredBookings.length > 0 && (
          <Box mt="8" boxShadow="md" borderRadius="md" bg="white" p="6">
            <Heading size="md" mb="4">Bookings for Selected Bus</Heading>
            <Table variant="striped" colorScheme="purple">
              <Thead>
                <Tr>
                  <Th>User Name</Th>
                  <Th>Email</Th>
                  <Th>Seat Number</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBookings.map((booking) => (
                  <Tr key={booking._id}>
                    <Td>{booking.userId.name}</Td>
                    <Td>{booking.userId.email}</Td>
                    <Td>{booking.seatNo}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

    </Box>
  );
};

export default AdminDashboard;
