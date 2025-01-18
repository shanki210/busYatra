import React from 'react';
import { Box, Flex, Heading ,Text} from '@chakra-ui/react';
import Header from './Header';
import SearchForm from './SearchForm';

const Home = () => {
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
         <Heading
          as="h1"
          size="3xl"
          mb="6"
          textAlign="center"
          color="yellow.400"
          fontWeight="extrabold"
          textShadow="2px 2px 8px rgba(0,0,0,0.8)"
          animation="bounce 3s infinite"
        >
          Welcome to BusYatra
        </Heading>
        <Text 
          fontSize="lg" 
          mb="8" 
          textAlign="center" 
          color="yellow.400"
          animation="fadeIn 2s"
        >
          Your journey starts here. Book tickets and explore the world with ease and comfort.
        </Text>
        <SearchForm />
      </Flex>
    </Box>
  );
};

export default Home;
