import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Box, VStack, FormControl, FormLabel, Input, Button, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post('http://localhost:8080/auth/login', { email, password }, config);
      localStorage.setItem("user", JSON.stringify(data));

      if (data.isAdmin) {
        alert("Admin Login Successful");
        login();
        navigate('/admin/dashboard');
      } else {
        alert("User Login Successful");
        login();
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Box p={8} w={{ base: '90%', md: '400px' }} my="12" mx="auto" borderWidth={1} borderRadius="lg">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} placeholder="Enter Email" onChange={handleEmailChange} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} placeholder="Enter Password" onChange={handlePasswordChange} />
          </FormControl>
          <Button colorScheme="blue" w="full" type="submit">
            Login
          </Button>
          <Text textAlign="center">
            Not registered? <Link to="/register" style={{ color: 'blue', textDecoration: 'underline' }}>Sign Up</Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
