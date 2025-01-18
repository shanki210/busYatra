import React, { useState, useRef } from 'react';
import { Box, Button, Input, FormLabel, Select, Alert ,VStack,Text,Heading,Flex} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

const DriverKYC = () => {
  const [dlFile, setDlFile] = useState(null);
  const [dlValidated, setDlValidated] = useState(false);
  const [idCardFile, setIdCardFile] = useState(null);
  const [idCardType, setIdCardType] = useState('Aadhaar');
  const [selfieValidated, setSelfieValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const videoRef = useRef(null);
  const [selfieBlob, setSelfieBlob] = useState(null);
  const navigate = useNavigate();
  const [kycCompleted, setKycCompleted] = useState(false);
  const [documentId,setdocumentId] = useState('id')

  React.useEffect(() => {
    console.log(idCardType);  // This will log the updated idCardType after state changes
    console.log(documentId)
  }, [idCardType]);

  React.useEffect(() => {
    if (kycCompleted) {
      setTimeout(() => navigate('/'), 5000);
    }
  }, [kycCompleted, navigate]);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleDLSubmit = async (e) => {
    e.preventDefault();
    if (!dlFile) {
      setError('Please upload the Driver’s License.');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', dlFile);
      formData.append('countryId', 'ind');
      formData.append('documentId', 'dl');
      formData.append('expectedDocumentSide', 'front');

      const response = await axios.post('https://ind.idv.hyperverge.co/v1/readId', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          appId: process.env.REACT_APP_ID,
          appKey: process.env.REACT_APP_KEY,
          transactionId: 'DL_VALIDATION_' + Date.now(),
        },
      });

      const details = response.data.result.details[0].fieldsExtracted;
      const isDLValid = details.dateOfExpiry.value && new Date(details.dateOfExpiry.value) > new Date();
      if (!isDLValid) {
        setError('Driver’s License is invalid or expired.');
      } else {
        setDlValidated(true);
        setSuccess('Driver’s License validated successfully. Proceed with ID card verification.');
      }
    } catch (err) {
      setError('An error occurred during DL validation. Please try again.');
      console.error(err);
    }
  };

  const handleIDCardSubmit = async (e) => {
    e.preventDefault();
    if (!idCardFile) {
      setError('Please upload the ID Card.');
      return;
    }
    setError('');
    try {
      const formDataID = new FormData();
      formDataID.append('image', idCardFile);
      formDataID.append('countryId', 'ind');
      formDataID.append('documentId', documentId);
      formDataID.append('expectedDocumentSide', 'front');

      const responseID = await axios.post('https://ind.idv.hyperverge.co/v1/readId', formDataID, {
        headers: {
          'content-type': 'multipart/form-data',
          appId: process.env.REACT_APP_ID,
          appKey: process.env.REACT_APP_KEY,
          transactionId: 'ID_VALIDATION_' + Date.now(),
        },
      });

      const detailsID = responseID.data.result.details[0].fieldsExtracted;
      if (detailsID && responseID.data.result.summary.action === 'pass') {
        setSuccess('ID card validated successfully. Proceed with selfie verification.');
        setDlValidated(false);
        setSelfieValidated(true);
      } else {
        setError('ID Card validation failed. Please review the extracted data for accuracy.');
      }
    } catch (err) {
      setError('An error occurred during ID card validation. Please try again.');
      console.error(err);
    }
  };

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setError('Unable to access the camera.');
      });
  };

  const captureSelfie = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => setSelfieBlob(blob), 'image/png');
    video.srcObject.getTracks().forEach((track) => track.stop());
  };

  const handleSelfieSubmit = async () => {
    if (!selfieBlob) {
      setError('Please take a selfie first.');
      return;
    }
    setError('');
    try {
      const formDataSelfie = new FormData();
      formDataSelfie.append('image', selfieBlob);

      const responseSelfie = await axios.post('https://ind.idv.hyperverge.co/v1/checkLiveness', formDataSelfie, {
        headers: {
          'content-type': 'multipart/form-data',
          appId: process.env.REACT_APP_ID,
          appKey: process.env.REACT_APP_KEY,
          transactionId: 'SELFIE_VALIDATION_' + Date.now(),
        },
      });

      if (responseSelfie.data.result.details.liveFace.value === 'yes') {
        setSuccess('Selfie verified successfully. KYC process completed.');
        await handleFaceMatch(); // Call the next step after successful liveness check
      } else {
        setError('Selfie validation failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during selfie validation. Please try again.');
      console.error(err);
    }
  };

  const handleFaceMatch = async () => {
    if (!selfieBlob || !idCardFile) {
      setError('Please take a selfie and upload an ID card.');
      return;
    }
    try {
      const formDataMatch = new FormData();
      formDataMatch.append('selfie', selfieBlob, 'selfie.png');
      formDataMatch.append('id', idCardFile);
  
      const responseMatch = await axios.post('https://ind.idv.hyperverge.co/v1/matchFace', formDataMatch, {
        headers: {
          'content-type': 'multipart/form-data',
          appId: process.env.REACT_APP_ID,
          appKey: process.env.REACT_APP_KEY,
          transactionId: 'FACE_MATCH_' + Date.now(),
        },
      });
  
      const matchResult = responseMatch.data.result.details.match;
      console.log(responseMatch)
      if (matchResult.value === 'yes') {
        setSuccess(`Face match successful with score: ${matchResult.score}. KYC process completed.`);
        setKycCompleted(true);  // Set KYC completion status
      } else {
        setError('Face match failed. Please retry with clearer images.');
      }
    } catch (err) {
      setError('An error occurred during face matching. Please try again.');
      console.error(err);
    }
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
      <Box 
        p={6} 
        maxW="500px" 
        mx="auto" 
        bg="white" 
        boxShadow="2xl" 
        borderRadius="lg"
        mt={10}
      
      >
        <Heading as="h2" size="lg" mb={6} color="blue.700" textAlign="center">
          Complete Your KYC
        </Heading>
        {!kycCompleted ? (
          <VStack spacing={8}>
            {!dlValidated && !selfieValidated ? (
              <form onSubmit={handleDLSubmit}>
                <VStack spacing={4}>
                  <FormLabel fontSize="lg" color="blue.700">
                    Upload Driver’s License
                  </FormLabel>
                  <Input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    onChange={(e) => handleFileChange(e, setDlFile)} 
                    bg="gray.50" 
                    border="2px" 
                    borderColor="blue.300"
                  />
                  <Button type="submit" colorScheme="blue" size="lg" w="full">
                    Validate DL
                  </Button>
                </VStack>
              </form>
            ) : !selfieValidated ? (
              <form onSubmit={handleIDCardSubmit}>
                <VStack spacing={4}>
                  <FormLabel fontSize="lg" color="blue.700">
                    Select ID Card Type
                  </FormLabel>
                  <Select 
                    value={idCardType} 
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === 'Aadhaar') {
                        setIdCardType('Aadhaar');
                        setdocumentId('id')
                      } else if (selectedValue === 'Passport') {
                        setIdCardType('Passport');
                        setdocumentId('passport')
                      } else if (selectedValue === 'PAN Card') {
                        setIdCardType('PAN Card');
                        setdocumentId('pan');
                      }
                    }} 
                    bg="gray.50" 
                    border="2px" 
                    borderColor="blue.300"
                  >
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Passport">Passport</option>
                    <option value="PAN Card">PAN Card</option>
                  </Select>

                  <FormLabel fontSize="lg" color="blue.700" mt={4}>
                    Upload ID Card
                  </FormLabel>
                  <Input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    onChange={(e) => handleFileChange(e, setIdCardFile)} 
                    bg="gray.50" 
                    border="2px" 
                    borderColor="blue.300"
                  />
                  <Button type="submit" colorScheme="green" size="lg" w="full" mt={6}>
                    Validate ID Card
                  </Button>
                </VStack>
              </form>
            ) : (
              <VStack spacing={4}>
                <Button onClick={startCamera} colorScheme="blue" size="lg" w="full">
                  Start Camera
                </Button>
                <Box w="full" borderRadius="md" overflow="hidden" mt={4} boxShadow="lg">
                  <video ref={videoRef} autoPlay playsInline width="100%" />
                </Box>
                <Button onClick={captureSelfie} colorScheme="green" size="lg" w="full">
                  Capture Selfie
                </Button>
                <Button onClick={handleSelfieSubmit} colorScheme="blue" size="lg" w="full" mt={4}>
                  Submit for Liveness and Face Match
                </Button>
              </VStack>
            )}
            {error && <Alert status="error" borderRadius="md" mt={4}>{error}</Alert>}
            {success && <Alert status="success" borderRadius="md" mt={4}>{success}</Alert>}
          </VStack>
        ) : (
          <Box textAlign="center" mt={6}>
            <CheckCircleIcon boxSize="50px" color="green.500" />
            <Text fontSize="lg" fontWeight="bold" color="green.700" mt={4}>
              KYC process completed successfully!
            </Text>
            <Alert status="success" borderRadius="md" mt={4}>
              Redirecting to home...
            </Alert>
          </Box>
        )}
      </Box>
      </Flex>
    </Box>
    
  );
};

export default DriverKYC;
