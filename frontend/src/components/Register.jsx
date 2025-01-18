import React, { useState } from 'react';
import axios from "axios"
import { Box, VStack, FormControl, FormLabel, Input, Button, Heading, Text, IconButton } from '@chakra-ui/react';
import { Link, Navigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShowPassword] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    try {
      const data = await axios.post('http://localhost:8080/auth/register', { name, email, password }, config);
      alert("Registration successful");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box p={8} w={{ base: '90%', md: '400px' }} my="12"  mx="auto" borderWidth={1} borderRadius="lg">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={name} placeholder="Enter Name" onChange={handleNameChange} />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} placeholder="Enter Email" onChange={handleEmailChange} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type={show ? 'text' : 'password'}
              value={password}
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              pr="4.5rem"
            />
            <IconButton
              aria-label="Toggle Password Visibility"
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              onClick={toggleShowPassword}
              variant="ghost"
              size="sm"
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-5%)"
            />
          </FormControl>
          <Button colorScheme="blue" w="full" type="submit">
            Register
          </Button>
          <Text textAlign="center">
            Already registered? <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Login</Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
